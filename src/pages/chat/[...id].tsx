import { useEffect } from 'react';
import { type GetServerSideProps } from 'next';
import { default as router, useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import type { NextPageWithLayout } from '@/pages/_app';
import { Chat } from '@/components/Chat/Chat';
import { getLayout } from '@/components/Layout/Layout';
import { api } from '@/utils/api';
import { authOptions } from '@/server/auth';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, authOptions)
    }
  };
};

function ChatPageComponent({ chatId }: { chatId?: string }) {
  const chats = api.chat.all.useQuery(undefined, {
    enabled: false
  });
  const chat = chats.data?.find(c => c.id === chatId);
  const shouldRedirect = !!chatId && chats.isSuccess && !chat;

  useEffect(() => {
    if (shouldRedirect) {
      router.push({ pathname: '/' }).catch(() => void 0);
    }
  }, [shouldRedirect]);

  return <Chat chat={chat} />;
}

const ChatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [id] = Array.isArray(router.query.id) ? router.query.id : [router.query.id];
  return <ChatPageComponent chatId={id} />;
};

ChatPage.getLayout = getLayout;

export default ChatPage;
