import type { IncomingMessage } from 'http';
import { EventEmitter } from 'events';
import { z } from 'zod';
import type { Message } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import {
  openai,
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionStreamResponse
} from '@/utils/openai';
import { prisma } from '@/server/db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
// import { tiktoken } from '@/utils/tiktoken/tiktoken';

const ee = new EventEmitter();

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ chat: z.string() })).query(async req => {
    return prisma.message.findMany({ where: { chatId: req.input.chat, chat: { userId: req.ctx.session.user.id } } });
  }),
  stream: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
        ref: z.string(), // for frontend,
        conversation: z.boolean().optional().default(true)
      })
    )
    .mutation(async req => {
      const chat = await prisma.chat.findFirst({
        where: { id: req.input.chatId, userId: req.ctx.session.user.id }
      });

      if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

      const newMessage: ChatCompletionRequestMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: req.input.content
      };

      const messages: ChatCompletionRequestMessage[] = req.input.conversation
        ? await prisma.message
            .findMany({ where: { chatId: req.input.chatId } })
            .then(messages => [
              ...messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
              newMessage
            ])
        : [newMessage];

      const resp = await openai.createChatCompletion(
        {
          model: chat.model,
          messages,
          stream: true
        },
        { responseType: 'stream' }
      );

      const streamResp = resp.data as unknown as IncomingMessage;
      const event = req.input.ref;
      let answer = '';

      const onData = (data: ArrayBuffer): void => {
        const lines = data.toString().trim().split('\n');

        for (const line of lines) {
          const content = line.replace(/^data: +/gm, '');
          if (content === '[DONE]') {
            onComplete();
            break;
          }

          try {
            const resp = JSON.parse(content.trim()) as ChatCompletionStreamResponse;
            answer += resp.choices[0]?.delta[0]?.content || '';
            ee.emit(event, answer);
          } catch (error) {
            // emit.error(error);
            // TODO: throw error
          }
        }
      };

      const onComplete = () => {
        streamResp.off('data', onData);
        // TODO: calc tokens used
      };

      streamResp.on('data', onData);
    }),
  send: protectedProcedure
    .input(
      z.object({
        chat: z.string(),
        content: z.string(),
        ref: z.string() // for frontend
      })
    )
    .mutation(async req => {
      const chat = await prisma.chat.findFirst({
        where: { id: req.input.chat, userId: req.ctx.session.user.id },
        include: { messages: true }
      });

      if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

      const message = { role: ChatCompletionRequestMessageRoleEnum.User, content: req.input.content };

      try {
        let replyPayload: Omit<Message, 'id'>;

        const connectChatGPT = true || process.env.NODE_ENV === 'production';

        if (connectChatGPT) {
          const messages = [
            ...chat.messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
            message
          ];

          const resp = await openai.createChatCompletion({
            model: chat.model,
            messages
          });

          const { usage, choices } = resp.data;

          const choice = choices[0];
          if (!choice || !choice.message?.content) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

          replyPayload = {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: choice.message.content,
            chatId: chat.id,
            usage: { ...usage }
          };
        } else {
          replyPayload = {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: 'Hello! How can I assist you today?',
            chatId: chat.id,
            usage: null
          };
        }

        const question = await prisma.message.create({ data: { ...message, chatId: chat.id } });
        const reply = await prisma.message.create({ data: replyPayload });

        return { question, reply };
      } catch (error) {
        console.error({ error });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  edit: protectedProcedure.input(z.object({ id: z.string(), content: z.string() })).mutation(async req => {
    const message = await prisma.message.findFirst({ where: { id: req.input.id }, include: { chat: true } });

    if (message && !message.chat?.userId) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    if (!message || message.chat?.userId !== req.ctx.session.user.id) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return prisma.message.update({ where: { id: message.id }, data: { content: req.input.content } });
  }),
  streamMessage: publicProcedure.input(z.object({ chatId: z.string() })).subscription(req => {
    const event = req.input.chatId;
    return observable<string>(emit => {
      const onAdd = (data: string) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on(event, onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off(event, onAdd);
      };
    });
  })
});
