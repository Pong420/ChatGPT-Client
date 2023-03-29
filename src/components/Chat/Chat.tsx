import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Container, Stack, createStyles } from '@mantine/core';
import type { Chat as ChatData } from '@prisma/client';
import { api } from '@/utils/api';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import { isPromptCommand } from '@/utils/prompts';
import { useReply } from '@/hooks/useReply';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { gotoChat, useCreateChat } from '@/hooks/useCreateChat';
import { UnkownChatID } from '@/constant';
import { ChatMessage } from './ChatMessage';
import { InputArea } from './InputArea';
import { ChatEmpty } from './ChatEmpty';

export interface ChatProps {
  chat?: ChatData;
}

// TODO: do not scroll to bottom if user not in bottom

const useStyles = createStyles(theme => ({
  root: {
    height: '100%'
  },
  messages: {
    flex: 1,
    '> :nth-of-type(even)': {
      backgroundColor: theme.colors.dark[5]
    }
  },
  gradient: {
    position: 'sticky',
    bottom: '0',
    width: '100%',
    padding: `${theme.spacing.md} 0`,
    background: `linear-gradient(to bottom, ${theme.fn.rgba(theme.colors.dark[9], 0.1)} 0%, ${
      theme.colors.dark[9]
    } 200%)`
  }
}));

export function Chat({ chat }: ChatProps) {
  const { classes } = useStyles();
  const [tempChat, setTempChat] = useState<ChatData>();

  const chatId = chat?.id || UnkownChatID;

  const context = api.useContext();
  const messages = api.message.all.useQuery({ chatId });
  const data = messages.data || [];

  const createChat = useCreateChat();

  const insertUserMessage = ({ ref, content, chatId }: NonNullable<(typeof sendMessage)['variables']>) => {
    context.message.all.setData(
      { chatId },
      m => m && [...m, { id: ref, role: ChatCompletionRequestMessageRoleEnum.User, content, chatId, usage: null }]
    );
  };

  const sendMessage = api.message.send.useMutation({
    onMutate: payload => {
      insertUserMessage(payload);
    },
    onSuccess: ({ chatId, question, reply }, { ref }) => {
      context.message.all.setData({ chatId }, m => m && m.map(n => (n.id === ref ? question : n)).concat(reply));
    }
  });

  const handleSendMessage = async (content: string) => {
    const system = isPromptCommand(content);
    const ref = nanoid();

    if (chatId === UnkownChatID || system) {
      if (!system) {
        insertUserMessage({ chatId, ref, content });
      }

      const chat = await createChat.mutateAsync({ system });
      setTempChat(chat);

      if (!system) {
        const { question, reply } = await sendMessage.mutateAsync({ chatId: chat.id, content, ref });
        const messages = [question, reply];
        context.message.all.setData({ chatId }, messages);
        context.message.all.setData({ chatId: chat.id }, messages);
      }

      await gotoChat(chat.id);

      setTempChat(undefined);
    } else {
      sendMessage.mutate({ chatId, content, ref });
    }
  };

  const isLoading = createChat.isLoading || sendMessage.isLoading;
  const waitForReply =
    isLoading && !!data.length && data.slice(-1)[0]?.role === ChatCompletionRequestMessageRoleEnum.User;

  const reply = useReply(sendMessage.isLoading ? chatId : '');

  useScrollToBottom({
    // scroll to bottom on new message or reply update
    smooth: [data.length, reply.message.content],
    // scroll to bottom immediately when all messages loaded
    instant: [messages.isSuccess]
  });

  return (
    <Stack className={classes.root} spacing={0}>
      <div className={classes.messages}>
        {data.map(m => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {waitForReply && <ChatMessage typing message={reply.message} />}
        {!data.length && !isLoading && <ChatEmpty system={chat?.system || tempChat?.system} />}
      </div>
      <div className={classes.gradient}>
        <Container>
          {/* FIXME: */}
          {/* eslint-disable-next-line */}
          <InputArea loading={isLoading} onSubmit={handleSendMessage} />
        </Container>
      </div>
    </Stack>
  );
}
