import { IconPlus } from '@tabler/icons-react';
import { useCreateChat } from '@/hooks/useCreateChat';
import { ChatAction } from './ChatAction';

export function CreateChat() {
  const create = useCreateChat();
  return <ChatAction icon={IconPlus} onClick={() => create.mutate({})} loading={create.isLoading} />;
}
