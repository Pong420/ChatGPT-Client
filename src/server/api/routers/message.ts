import { z } from 'zod';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure.input(z.object({ chat: z.string() })).query(async req => {
    return prisma.message.findMany({ where: { chatId: req.input.chat, chat: { userId: req.ctx.session.user.id } } });
  }),
  send: protectedProcedure
    .input(
      z.object({
        chat: z.string(),
        content: z.string()
      })
    )
    .mutation(async req => {
      const chat = await prisma.chat.findFirst({
        where: { id: req.input.chat, userId: req.ctx.session.user.id },
        include: { messages: true }
      });

      if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

      const message = { role: 'user', content: req.input.content };

      const resp = await prisma.message.create({ data: { ...message, chatId: chat.id } });

      // TODO: chat gtp api

      return resp;
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
