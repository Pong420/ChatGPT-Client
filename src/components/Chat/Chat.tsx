import { useEffect, useState } from 'react';
import { Text, Center, Container, Stack, createStyles } from '@mantine/core';
import { api } from '@/utils/api';
import { ChatMessage } from './ChatMessage';
import { InputArea } from './InputArea';

export interface ChatProps {
  chatId: string;
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
    background: `linear-gradient(to bottom, ${theme.fn.rgba(theme.colors.dark[9], 0.1)} 0%, ${
      theme.colors.dark[9]
    } 200%)`
  }
}));

export function Chat({ chatId }: ChatProps) {
  const { classes } = useStyles();
  const [waitForReply, setWaitForReply] = useState(false);

  const messages = api.message.all.useQuery({ chat: chatId }, { refetchIntervalInBackground: false });
  const data = messages.data || [];

  useEffect(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }, [data.length]);

  useEffect(() => {
    if (messages.isSuccess) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [chatId, messages.isSuccess]);

  return (
    <Stack className={classes.root} spacing={0}>
      <div className={classes.messages}>
        {data.length ? (
          <>
            {data.map((m, idx) => (
              <ChatMessage key={idx} message={m} />
            ))}
            {messages.isLoading ? null : waitForReply && <ChatMessage />}
          </>
        ) : (
          <Center h="100%">
            <Text align="center" fw="bold">
              No messages exist. Let&apos;s start by asking your first question
            </Text>
          </Center>
        )}
      </div>
      <Container className={classes.gradient} pos="sticky" size="100%" bottom="0" p="md" m="0">
        <Container>
          <InputArea chatId={chatId} onLoad={setWaitForReply} />
        </Container>
      </Container>
    </Stack>
  );
}
