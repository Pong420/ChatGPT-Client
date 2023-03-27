import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth';
import { type ReplyData, getReply, subscribeReply } from '@/server/reply';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  const { chatId } = req.query;

  if (typeof chatId !== 'string') {
    throw new Error(`Missing param chatId`);
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return res.end('done\n');
  }

  const content = getReply({ userId, chatId });
  const write = (content?: string) => {
    if (!content) return;
    const data: ReplyData = { content };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  write(content);

  await subscribeReply({ userId, chatId }, write);

  res.end('done\n');
};

export default handler;
