import { z } from 'zod';
import { prisma } from '@/server/db';
import { createTRPCRouter, developmentProcedure } from '../trpc';
import { hash } from '@/server/auth';
import type { User } from '@prisma/client';

export const adminhRouter = createTRPCRouter({
  getUsers: developmentProcedure.query(async () => {
    const users = await prisma.user.findMany({});
    return users.map(({ password, ...u }) => ({ ...u } as User));
  }),
  createUser: developmentProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string()
      })
    )
    .mutation(async req => {
      const hasdPassword = await hash(req.input.password);
      const { password, ...user } = await prisma.user.create({ data: { ...req.input, password: hasdPassword } });
      return user;
    }),
  deleteUser: developmentProcedure.input(z.object({ id: z.string() })).mutation(async req => {
    const { password, ...user } = await prisma.user.delete({ where: { id: req.input.id } });
    return user;
  })
});
