import { z } from 'zod';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { ChatCompletionRequestMessageRoleEnum, openai } from '@/utils/openai';

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

      const question = await prisma.message.create({ data: { ...message, chatId: chat.id } });

      try {
        // const completion = await openai.createChatCompletion({
        //   model: chat.model,
        //   messages: [
        //     ...chat.messages.map(r => ({ role: r.role as ChatCompletionRequestMessageRoleEnum, content: r.content })),
        //     message
        //   ]
        // });

        // const choice = completion.data.choices[0];
        // if (!choice || !choice.message?.content) throw new TRPCError({ code: 'BAD_REQUEST' });

        // const reply = await prisma.message.create({
        //   data: {
        //     role: ChatCompletionRequestMessageRoleEnum.Assistant,
        //     content: choice.message.content,
        //     chatId: chat.id
        //   }
        // });

        const reply = await prisma.message.create({
          data: {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: 'Hello! How can I assist you today?',
            chatId: chat.id
          }
        });

        return { question, reply };
      } catch (error) {
        console.error(error);
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
