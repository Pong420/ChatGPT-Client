import { isMessages } from '@/utils/api';
import type { Conversation as ConversationData } from '@prisma/client';
import { ConversationMessage } from './ConversationMessage';
import { Container, TextInput, createStyles } from '@mantine/core';

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

const useStyles = createStyles({
  root: {
    position: 'relative'
  },
  messages: {
    '> :nth-of-type(even)': {
      backgroundColor: '#eee'
    }
  }
});

export function Conversation({ conversation }: ConversationProps) {
  const { messages } = conversation;

  if (!isMessages(messages)) {
    throw new Error('bad implementation');
  }

  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.messages}>
        {_messages.map((m, idx) => (
          <ConversationMessage key={idx} message={m} />
        ))}
      </div>
      <Container pos="sticky" size="100%" bottom="0" p="md" m="0" bg="#fff">
        <Container>
          <TextInput />
        </Container>
      </Container>
    </div>
  );
}
