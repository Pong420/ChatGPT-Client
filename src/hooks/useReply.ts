import { useState, useEffect } from 'react';
import type { Message } from '@prisma/client';
import type { ReplyData } from '@/server/reply';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';

export function useReply(chatId: string) {
  const [reply, setReply] = useState('');

  useEffect(() => {
    const event = new EventSource(`/api/reply?chatId=${chatId}`);
    const onMessage = (event: MessageEvent<string>) => {
      const { content } = JSON.parse(event.data) as ReplyData;
      setReply(content);
    };

    event.addEventListener('message', onMessage);

    return () => {
      event.removeEventListener('message', onMessage);
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
