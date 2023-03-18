import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { Conversation } from '@/components/Conversation/Conversation';
import { getLayout } from '@/components/Layout/Layout';
import { api } from '@/utils/api';
import { authOptions } from '@/server/auth';
import type { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, authOptions)
    }
  };
};

function ConversationPageComponent({ id }: { id: string }) {
  const conversation = api.conversation.getOne.useQuery({ id });

  if (conversation.isLoading) {
    return <div>Loading ...</div>;
  }

  if (!conversation.data) return null;

  return <Conversation conversation={conversation.data} />;
}

const ConversationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id;

  if (id === undefined) return null;

  if (typeof id !== 'string') {
    throw new Error(`internal server error`);
  }

  return <ConversationPageComponent id={id} />;
};

ConversationPage.getLayout = getLayout;

export default ConversationPage;
