/**
 * TODO: refactor simply the communication
 */

import { EventEmitter } from 'events';

export interface ReplyPayload {
  userId: string;
  chatId: string;
}

export interface EmitReplyPayload extends ReplyPayload {
  content: string;
}

export interface EmitReplyData {
  chatId: string;
  content: string;
}

export interface ReplyData {
  chatId: string;
  content: string;
}

const replyEmitter = new EventEmitter();

const Reply = new Map<string, string>();

export const emitReply = (p: EmitReplyPayload) => {
  const event = `${p.userId}`;

  if (p.content === '[DONE]') {
    Reply.delete(event);
  } else {
    Reply.set(event, p.content);
  }

  const data: EmitReplyData = { chatId: p.chatId, content: p.content };

  replyEmitter.emit(event, data);
};

export const getReply = (p: ReplyPayload) => {
  const event = `${p.userId}`;
  return Reply.get(event);
};

export const subscribeReply = async (p: ReplyPayload, callback: (content: EmitReplyData) => void) => {
  const event = `${p.userId}`;
  await new Promise<void>(resolve => {
    replyEmitter.on(event, function handler(p: EmitReplyData) {
      if (p.content === '[DONE]') {
        replyEmitter.off(event, handler);
        resolve();
      } else {
        callback(p);
      }
    });
  });
};
