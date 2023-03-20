import { useEffect } from 'react';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
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

const ChatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { push } = router;
  // id could be undefined
  const id = router.query.id;
  const chats = api.chat.all.useQuery(undefined, {
    enabled: false
  });
  const chat = chats.data?.find(c => c.id === id);
  const shouldRedirect = id && chats.isSuccess && !chat;

  useEffect(() => {
    if (shouldRedirect) {
      push({ pathname: '/' }).catch(() => void 0);
    }
  }, [shouldRedirect, push]);

  if (!chat) return null;

  return <Chat chat={chat} />;
};

ChatPage.getLayout = getLayout;

export default ChatPage;
