import type { IncomingMessage } from 'http';
import { z } from 'zod';
import type { Message } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {
  openai,
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionStreamResponse,
  type CreateCompletionResponseUsage
} from '@/utils/openai';
import { prisma } from '@/server/db';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { emitReply } from '@/server/reply';
import { tiktoken } from '@/utils/tiktoken/tiktoken';

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
      const userId = req.ctx.session.user.id;
      const { chatId } = req.input;
      const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId }
      });

      if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

      const question: ChatCompletionRequestMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: req.input.content
      };

      const messages: ChatCompletionRequestMessage[] = req.input.conversation
        ? await prisma.message
            .findMany({ where: { chatId } })
            .then(messages => [
              ...messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
              question
            ])
        : [question];

      const questionResp = await prisma.message.create({ data: { chatId, ...question } });

      const resp = await openai.createChatCompletion(
        {
          model: chat.model,
          messages,
          stream: true
        },
        { responseType: 'stream' }
      );

      const streamResp = resp.data as unknown as IncomingMessage;

      let answer = '';

      await new Promise<void>(resolve => {
        const onData = (data: ArrayBuffer): void => {
          const lines = data.toString().trim().split('\n');

          for (let line of lines) {
            line = line.replace(/^data: +/gm, '');
            if (line === '[DONE]') {
              onComplete();
              break;
            }

            try {
              const resp = JSON.parse(line.trim()) as ChatCompletionStreamResponse;
              const content = resp.choices[0]?.delta?.content || '';

              answer += content;
              emitReply({ userId, chatId, content: answer });
            } catch (error) {
              // emit.error(error);
              // TODO: throw error
            }
          }
        };

        const onComplete = () => {
          streamResp.off('data', onData);
          emitReply({ userId, chatId, content: '' });
          resolve();
        };

        streamResp.on('data', onData);
      });

      const promptUsed = await tiktoken({ content: JSON.stringify(messages) }).then(n => n - messages.length * 2);
      const completionUsed = await tiktoken({ content: answer });

      const usage: CreateCompletionResponseUsage = {
        prompt_tokens: promptUsed,
        completion_tokens: completionUsed,
        total_tokens: promptUsed + completionUsed
      };

      await prisma.usage.create({ data: { data: { ...usage }, userId: req.ctx.session.user.id } });

      const replyResp = await prisma.message.create({
        data: { chatId, content: answer, usage: { ...usage }, role: ChatCompletionRequestMessageRoleEnum.Assistant }
      });

      return { question: questionResp, reply: replyResp };
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
  })
});
