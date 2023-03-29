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
import { getPrompt } from '@/utils/prompts';
import { UnkownChatID } from '@/constant';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ chatId: z.string() })).query(async req => {
    return req.input.chatId === UnkownChatID
      ? ([] as Message[])
      : prisma.message.findMany({ where: { chatId: req.input.chatId, chat: { userId: req.ctx.session.user.id } } });
  }),
  send: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
        ref: z.string(), // for frontend,
        conversation: z.boolean().optional()
      })
    )
    .mutation(async req => {
      const userId = req.ctx.session.user.id;
      const { chatId, content, conversation } = req.input;
      const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId }
      });

      if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

      const systemPrompt = chat.system && getPrompt(chat.system);
      const systemMessages: ChatCompletionRequestMessage[] = systemPrompt
        ? [
            {
              role: ChatCompletionRequestMessageRoleEnum.System,
              content: systemPrompt
            }
          ]
        : [];

      const question: ChatCompletionRequestMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content
      };

      // If system message defined, do not include all conversation
      // Therefore less token used.
      const includeAllConversation = typeof conversation === 'boolean' ? conversation : !systemMessages.length;

      let messages: ChatCompletionRequestMessage[] = includeAllConversation
        ? await prisma.message
            .findMany({ where: { chatId } })
            .then(messages => [
              ...messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
              question
            ])
        : [question];

      messages = [...systemMessages, ...messages];

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
              // TODO: throw error
            }
          }
        };

        const onComplete = () => {
          streamResp.off('data', onData);
          emitReply({ userId, chatId, content: '[DONE]' });
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

      return { chatId: chat.id, question: questionResp, reply: replyResp };
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
