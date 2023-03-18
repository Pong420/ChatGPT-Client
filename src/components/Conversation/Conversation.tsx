import { isMessages } from '@/utils/api';
import type { Conversation as ConversationData } from '@prisma/client';

export interface ConversationProps {
  conversation: ConversationData;
}

export function Conversation({ conversation }: ConversationProps) {
  const { messages } = conversation;
  if (!isMessages(messages)) {
    throw new Error('bad implementation');
  }

  return (
    <div>
      <div></div>
      <div>
        {/* input */}
        {/* send */}
      </div>
    </div>
  );
}
