import { z } from 'zod';
import type { Message } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '@/server/db';
import { ChatCompletionRequestMessageRoleEnum, openai } from '@/utils/openai';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ chat: z.string() })).query(async req => {
    return prisma.message.findMany({ where: { chatId: req.input.chat, chat: { userId: req.ctx.session.user.id } } });
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
          const resp = await openai.createChatCompletion({
            model: chat.model,
            messages: [
              ...chat.messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
              message
            ]
          });

          const { usage, choices } = resp.data;

          if (usage) {
            await prisma.usage.create({ data: { data: { ...usage }, userId: req.ctx.session.user.id } });
          }

          const choice = choices[0];
          if (!choice || !choice.message?.content) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

          replyPayload = {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: choice.message.content,
            chatId: chat.id
          };
        } else {
          replyPayload = {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: 'Hello! How can I assist you today?',
            chatId: chat.id
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
