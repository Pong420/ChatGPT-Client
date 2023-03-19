import type { Conversation } from '@prisma/client';
import { IconEdit } from '@tabler/icons-react';
import { ConversationAction } from './ConversationAction';

export interface EditConversationProps {
  conversation: Conversation;
}

export function EditConversation({}: EditConversationProps) {
  return <ConversationAction icon={IconEdit} onClick={() => void 0} />;
}
