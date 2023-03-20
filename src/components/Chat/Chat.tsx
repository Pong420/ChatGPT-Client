import { useLayoutEffect } from 'react';
import { Container, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import type { Chat as ChatData } from '@prisma/client';
import { isMessages } from '@/utils/api';
import { ChatMessage } from './ChatMessage';
import { InputArea } from './InputArea';

export interface ChatProps {
  chat: ChatData;
}

const _messages = Array.from({ length: 10 }, () => [
  {
    role: 'user',
    content: 'hi'
  },
  {
    role: 'assistant',
    content: 'Hello! How can i assist you today!'
  }
]).flat();

const useStyles = createStyles(theme => ({
  root: {
    position: 'relative'
  },
  messages: {
    '> :nth-of-type(even)': {
      backgroundColor: theme.colors.dark[5]
    }
  },
  gradient: {
    background: `linear-gradient(to bottom, ${theme.fn.rgba(theme.colors.dark[9], 0.1)} 0%, ${
      theme.colors.dark[9]
    } 200%)`
  }
}));

export function Chat({ chat }: ChatProps) {
  const { messages } = chat;

  if (!isMessages(messages)) {
    throw new Error('bad implementation');
  }

  const { classes } = useStyles();
  const [content, setContent] = useInputState('');

  useLayoutEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [chat.id]);

  return (
    <div className={classes.root}>
      <div className={classes.messages}>
        {_messages.map((m, idx) => (
          <ChatMessage key={idx} message={m} />
        ))}
      </div>
      <Container className={classes.gradient} pos="sticky" size="100%" bottom="0" p="md" m="0">
        <Container>
          <InputArea value={content} onChange={setContent} onSubmit={console.log} />
        </Container>
      </Container>
    </div>
  );
}
