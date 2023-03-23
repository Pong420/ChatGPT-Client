import { createNextApiHandler } from '@trpc/server/adapters/next';
import { env } from '@/env.mjs';
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';
// import { QueryClient } from '@trpc/react-query';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchIntervalInBackground: false
//     }
//   }
// });

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // queryClient,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
        }
      : undefined
});
