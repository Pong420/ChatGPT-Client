import { api } from '@/utils/api';
import type { Chat } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import { ChatAction } from './ChatAction';

export interface DeleteChatProps {
  chat: Chat;
}

export function DeleteChat({ chat }: DeleteChatProps) {
  const context = api.useContext();
  const deleteChat = api.chat.delete.useMutation({
    onSuccess: ({ id }) => {
      context.chat.all.setData(undefined, c => c && c.filter(cc => cc.id !== id));
    }
  });
  return (
    <ChatAction icon={IconTrash} loading={deleteChat.isLoading} onClick={() => deleteChat.mutate({ id: chat.id })} />
  );
}
