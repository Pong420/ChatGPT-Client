import { EventEmitter, once } from 'events';

export interface ReplyPayload {
  userId: string;
  chatId: string;
}

export interface EmitReplyPayload extends ReplyPayload {
  content: string;
}

export interface ReplyData {
  content: string;
}

export const replyEmitter = new EventEmitter();

export const Reply = new Map<string, string>();

export const emitReply = (p: EmitReplyPayload) => {
  const key = `${p.userId}/${p.chatId}`;
  if (p.content === '[DONE]') {
    Reply.delete(key);
  } else {
    Reply.set(key, p.content);
  }
  replyEmitter.emit(key, p.content);
};

export const getReply = (p: ReplyPayload) => {
  return Reply.get(`${p.userId}/${p.chatId}`);
};

export const subscribeReply = (p: ReplyPayload, callback: (content: string) => void) => {
  const run = async () => {
    const event = `${p.userId}/${p.chatId}`;
    let done = false;

    while (!done) {
      const [content] = (await once(replyEmitter, event)) as [string];
      done = content === '[DONE]';
      callback(content);
    }
  };

  return run();
};
