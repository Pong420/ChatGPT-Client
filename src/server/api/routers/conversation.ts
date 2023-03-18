import { z } from 'zod';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const conversationRouter = createTRPCRouter({
  all: protectedProcedure.query(() => {
    return prisma.conversation.findMany({});
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(req => prisma.conversation.findFirst({ where: { id: req.input.id } })),
  create: protectedProcedure
    .input(
      z.object({
        mode: z.string().optional(),
        model: z.string().optional()
      })
    )
    .mutation(async req => {
      const conversation = await prisma.conversation.create({
        data: { userId: req.ctx.session.user.id, mode: '', model: '', messages: [] }
      });
      return conversation;
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async req => {
    // TODO: make it better
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.input.id,
        userId: req.ctx.session.user.id
      }
    });

    if (conversation) {
      return prisma.conversation.delete({ where: { id: req.input.id } });
    }

    throw new TRPCError({ code: 'NOT_FOUND' });
  })
});
