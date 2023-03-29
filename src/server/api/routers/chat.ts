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

const chatPayload = z.object({
  system: z.string().optional(),
  model: z.string().optional().default(DefalutChatGPTModel),
  title: z.string().optional()
});

export const chatRouter = createTRPCRouter({
  all: protectedProcedure.query(req => {
    return prisma.chat.findMany({ where: { userId: req.ctx.session.user.id } });
  }),
  create: protectedProcedure.input(chatPayload).mutation(async req => {
    const chat = await prisma.chat.create({
      data: {
        userId: req.ctx.session.user.id,
        ...req.input,
        // FIXME: override model
        model: DefalutChatGPTModel
      }
    });
    return chat;
  }),
  update: protectedProcedure.input(chatPayload.merge(z.object({ id: z.string() }))).mutation(async req => {
    const { id, model, ...payload } = req.input;

    // TODO: make it better
    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: req.ctx.session.user.id
      }
    });

    if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

    const newChat = await prisma.chat.update({
      where: { id },
      data: { ...payload }
    });

    return newChat;
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async req => {
    // TODO: make it better
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.input.id,
        userId: req.ctx.session.user.id
      }
    });

    if (!chat) throw new TRPCError({ code: 'NOT_FOUND' });

    await prisma.message.deleteMany({ where: { chatId: req.input.id } });
    return prisma.chat.delete({ where: { id: req.input.id } });
  })
});
