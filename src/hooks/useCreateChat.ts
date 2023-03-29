import router from 'next/router';
import { api } from '@/utils/api';

export function useCreateChat() {
  const context = api.useContext();
  return api.chat.create.useMutation({
    onSuccess: chat => {
      context.chat.all.setData(undefined, (chats = []) => [...chats, chat]);
    }
  });
}

export const gotoChat = async (chatId: string) => {
  await router.push(`/chat/${chatId}`);
};
