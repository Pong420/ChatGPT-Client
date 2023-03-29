import { useState, useEffect } from 'react';
import type { Message } from '@prisma/client';
import type { ReplyData } from '@/server/reply';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';

export function useReply(chatId: string) {
  const [reply, setReply] = useState('');
  const [retry, setRetry] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => setReply(''), [chatId]);

  useEffect(() => {
    if (!chatId) return;

    let retryTimeout: ReturnType<typeof setTimeout>;
    const event = new EventSource(`/api/reply?chatId=${chatId}`);

    /**
     * Note:
     * `addEventListener('message', callback)` is not working
     * https://developer.mozilla.org/en-US/docs/Web/API/EventSource#examples
     */
    event.onmessage = (event: MessageEvent<string>) => {
      const { content } = JSON.parse(event.data) as ReplyData;
      setReply(content);
    };

    event.onopen = () => {
      setConnected(true);
      clearTimeout(retryTimeout);
    };

    event.onerror = () => {
      if (event.readyState === event.CLOSED) {
        setConnected(false);
        retryTimeout = setTimeout(() => setRetry(r => r + 1), 1000);
      }
    };

    return () => {
      event.close();
      setConnected(false);
      clearTimeout(retryTimeout);
    };
  }, [chatId, retry]);

  const message: Message = {
    id: `reply-${chatId}`,
    chatId,
    usage: null,
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: reply
  };

  return { message, connected };
}
