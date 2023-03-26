import { useState } from 'react';
import { api } from '@/utils/api';
import { ChatMessage } from './ChatMessage';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export function ChatReply({ chatId }: { chatId: string }) {
  const [content, setContent] = useState('');

  api.message.streamMessage.useSubscription(
    { chatId },
    {
      onData(content) {
        setContent(content);
      }
    }
  );

  return (
    <ChatMessage
      message={{ id: 'reply', usage: null, content, chatId, role: ChatCompletionRequestMessageRoleEnum.Assistant }}
    />
  );
}
