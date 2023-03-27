import { useState, useEffect } from 'react';
import type { Message } from '@prisma/client';
import type { ReplyData } from '@/server/reply';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';

export function useReply(chatId: string) {
  const [reply, setReply] = useState('');

  useEffect(() => {
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

    return () => {
      event.close();
    };
  }, [chatId]);

  const message: Message = {
    id: `reply-${chatId}`,
    chatId,
    usage: null,
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: reply
  };

  return message;
}
