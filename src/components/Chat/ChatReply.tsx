import { useEffect, useState } from 'react';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import type { ReplyData } from '@/server/reply';
import { ChatMessage } from './ChatMessage';

/**
 * TODO:
 *
 * - cursor
 * - completed
 * - scroll
 */

export function ChatReply({ chatId }: { chatId: string }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const event = new EventSource(`/api/reply?chatId=${chatId}`);
    event.onmessage = (event: MessageEvent<string>) => {
      const { content } = JSON.parse(event.data) as ReplyData;
      setContent(content);
    };

    return () => {
      event.close();
    };
  }, [chatId]);

  return (
    <ChatMessage
      message={{ id: 'reply', usage: null, content, chatId, role: ChatCompletionRequestMessageRoleEnum.Assistant }}
    />
  );
}
