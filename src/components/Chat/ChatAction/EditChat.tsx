import type { Chat } from '@prisma/client';
import { IconEdit } from '@tabler/icons-react';
import { ChatAction } from './ChatAction';

export interface EditChatProps {
  chat: Chat;
}

export function EditChat({}: EditChatProps) {
  return <ChatAction icon={IconEdit} onClick={() => void 0} />;
}
