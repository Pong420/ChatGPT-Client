import { createTRPCRouter } from '@/server/api/trpc';
import { adminhRouter } from './routers/admin';
import { conversationRouter } from './routers/conversation';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminhRouter,
  conversation: conversationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
