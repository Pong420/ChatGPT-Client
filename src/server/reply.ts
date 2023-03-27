import { EventEmitter } from 'events';

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
  Reply.set(key, p.content);
  replyEmitter.emit(key, p.content);
};

export const getReply = (p: ReplyPayload) => {
  return Reply.get(`${p.userId}/${p.chatId}`);
};

export const subscribeReply = (p: ReplyPayload, callback: (content: string) => void) => {
  return new Promise<void>((resolve, _reject) => {
    const event = `${p.userId}/${p.chatId}`;
    const onReply = (content: string) => {
      if (content === '[DONE]') {
        replyEmitter.off(event, onReply);
        resolve();
      } else {
        callback(content);
      }
    };
    replyEmitter.on(event, onReply);
  });
};
