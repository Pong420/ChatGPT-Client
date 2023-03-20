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
    onSuccess: chat =>
      context.chat.all.setData(undefined, c => c && c.filter(c => c.id !== chat.id))
  });
  return (
    <ChatAction
      icon={IconTrash}
      onClick={() => deleteChat.mutate({ id: chat.id })}
      loading={deleteChat.isLoading}
    />
  );
}
