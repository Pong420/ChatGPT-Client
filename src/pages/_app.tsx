import type { NextPage } from 'next';
import { default as Head } from 'next/head';
import { type AppProps } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { type GetLayout } from '@/components/Layout/Layout';
import { api } from '@/utils/api';
import '@/styles/globals.css';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type MyAppProps = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: MyAppProps) => {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light'
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
