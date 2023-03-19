import { useEffect } from 'react';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import type { NextPageWithLayout } from '@/pages/_app';
import { Conversation } from '@/components/Conversation/Conversation';
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

const ConversationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { push } = router;
  // id could be undefined
  const id = router.query.id;
  const conversations = api.conversation.all.useQuery(undefined, {
    enabled: false
  });
  const conversation = conversations.data?.find(c => c.id === id);
  const shouldRedirect = id && conversations.isSuccess && !conversation;

  useEffect(() => {
    if (shouldRedirect) {
      push({ pathname: '/' }).catch(() => void 0);
    }
  }, [shouldRedirect, push]);

  if (!conversation) return null;

  return <Conversation conversation={conversation} />;
};

ConversationPage.getLayout = getLayout;

export default ConversationPage;
