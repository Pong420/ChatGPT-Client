import { useLayoutEffect } from 'react';
import { Container, Stack, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { ChatMessage } from './ChatMessage';
import { InputArea } from './InputArea';
import { api } from '@/utils/api';

export interface ChatProps {
  chatId: string;
}

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
  const [content, setContent] = useInputState('');
  const apiContext = api.useContext();
  const messages = api.message.all.useQuery({ chat: chatId });
  const data = messages.data || [];

  const sendMessage = api.message.send.useMutation({
    onSuccess: resp => {
      apiContext.message.all.setData({ chat: chatId }, m => m && [...m, resp]);
    }
  });
  const onSubmit = (content: string) => {
    sendMessage.mutate({ chat: chatId, content });
    setContent('');
  };

  useLayoutEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [chatId]);

  return (
    <Stack className={classes.root} spacing={0}>
      <div className={classes.messages}>
        {data.map((m, idx) => (
          <ChatMessage key={idx} message={m} />
        ))}
      </div>
      <Container className={classes.gradient} pos="sticky" size="100%" bottom="0" p="md" m="0">
        <Container>
          <InputArea value={content} onChange={setContent} onSubmit={onSubmit} />
        </Container>
      </Container>
    </Stack>
  );
}
