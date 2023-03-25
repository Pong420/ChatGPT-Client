import { z } from 'zod';
import { prisma } from '@/server/db';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const usageRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        from: z.date(),
        to: z.date()
      })
    )
    .query(req => {
      return prisma.usage.findMany({
        where: {
          userId: req.ctx.session.user.id,
          createdAt: { lte: req.input.to, gte: req.input.from }
        }
      });
    })
});
