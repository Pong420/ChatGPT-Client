import { useLayoutEffect } from 'react';
import { Container, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import type { Conversation as ConversationData } from '@prisma/client';
import { isMessages } from '@/utils/api';
import { ConversationMessage } from './ConversationMessage';
import { InputArea } from './InputArea';

export interface ConversationProps {
  conversation: ConversationData;
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

export function Conversation({ conversation }: ConversationProps) {
  const { messages } = conversation;

  if (!isMessages(messages)) {
    throw new Error('bad implementation');
  }

  const { classes } = useStyles();
  const [content, setContent] = useInputState('');

  useLayoutEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [conversation.id]);

  return (
    <div className={classes.root}>
      <div className={classes.messages}>
        {_messages.map((m, idx) => (
          <ConversationMessage key={idx} message={m} />
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
