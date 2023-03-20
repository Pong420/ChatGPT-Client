import { createTRPCRouter } from '@/server/api/trpc';
import { adminhRouter } from './routers/admin';
import { chatRouter } from './routers/chat';
import { messageRouter } from './routers/message';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminhRouter,
  chat: chatRouter,
  message: messageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
