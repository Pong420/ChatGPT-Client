import { z } from 'zod';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { DefalutChatGPTModel } from '@/constant';
import { createTRPCRouter, protectedProcedure } from '../trpc';

/**
 * TODO:
 * - verify modle is valid
 *   https://platform.openai.com/docs/api-reference/models
 */

export const chatRouter = createTRPCRouter({
  all: protectedProcedure.query(req => {
    return prisma.chat.findMany({ where: { userId: req.ctx.session.user.id } });
  }),
  create: protectedProcedure
    .input(
      z.object({
        mode: z.string().optional(),
        model: z.string().optional()
      })
    )
    .mutation(async req => {
      const chat = await prisma.chat.create({
        data: { userId: req.ctx.session.user.id, mode: '', model: DefalutChatGPTModel }
      });
      return chat;
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async req => {
    // TODO: make it better
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.input.id,
        userId: req.ctx.session.user.id
      }
    });

    if (chat) {
      return prisma.chat.delete({ where: { id: req.input.id } });
    }

    throw new TRPCError({ code: 'NOT_FOUND' });
  })
});
