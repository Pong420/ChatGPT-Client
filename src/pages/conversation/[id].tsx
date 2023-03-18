import { Conversation } from '@/components/Conversation/Conversation';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';

export default function ConversationPage() {
  const router = useRouter();
  const id = router.query.id;

  if (id === undefined) return null;

  if (typeof id !== 'string') {
    throw new Error(`internal server error`);
  }

  return <ConversationPageComponent id={id} />;
}

function ConversationPageComponent({ id }: { id: string }) {
  const conversation = api.conversation.getOne.useQuery({ id });

  if (conversation.isLoading) {
    return <div>Loading ...</div>;
  }

  if (!conversation.data) return null;

  return <Conversation conversation={conversation.data} />;
}
