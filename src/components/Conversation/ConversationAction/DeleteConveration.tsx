import { api } from '@/utils/api';
import type { Conversation } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import { ConversationAction } from './ConversationAction';

export interface DeleteConverationProps {
  conversation: Conversation;
}

export function DeleteConveration({ conversation }: DeleteConverationProps) {
  const context = api.useContext();
  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: conversation =>
      context.conversation.all.setData(undefined, c => c && c.filter(c => c.id !== conversation.id))
  });
  return (
    <ConversationAction
      icon={IconTrash}
      onClick={() => deleteConversation.mutate({ id: conversation.id })}
      loading={deleteConversation.isLoading}
    />
  );
}
