import { z } from 'zod';
import { prisma } from '@/server/db';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const adminhRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({});
    return users;
  }),
  createUser: publicProcedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async req => {
    const user = await prisma.user.create({ data: req.input });
    return user;
  }),
  deleteUser: publicProcedure.input(z.object({ id: z.string() })).mutation(async req => {
    const user = await prisma.user.delete({ where: { id: req.input.id } });
    return user;
  })
});
