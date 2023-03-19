import router from 'next/router';
import { api } from '@/utils/api';
import { IconPlus } from '@tabler/icons-react';
import { ConversationAction } from './ConversationAction';

export function CreateConversation() {
  const context = api.useContext();
  const create = api.conversation.create.useMutation({
    onSuccess: conversation => {
      context.conversation.all.setData(undefined, c => c && [...c, conversation]);
      router.push(`/conversation/${conversation.id}`).catch(() => void 0);
    }
  });
  return <ConversationAction icon={IconPlus} onClick={() => create.mutate({})} loading={create.isLoading} />;
}
