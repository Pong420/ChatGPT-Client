import router from 'next/router';
import { api } from '@/utils/api';
import { IconPlus } from '@tabler/icons-react';
import { ChatAction } from './ChatAction';

export function CreateChat() {
  const context = api.useContext();
  const create = api.chat.create.useMutation({
    onSuccess: chat => {
      context.chat.all.setData(undefined, c => c && [...c, chat]);
      router.push(`/chat/${chat.id}`).catch(() => void 0);
    }
  });
  return <ChatAction icon={IconPlus} onClick={() => create.mutate({})} loading={create.isLoading} />;
}
