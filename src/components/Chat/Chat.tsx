import { useLayoutEffect } from 'react';
import { Container, Stack, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { nanoid } from 'nanoid';
import { api } from '@/utils/api';
import { ChatMessage } from './ChatMessage';
import { InputArea } from './InputArea';

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
    onMutate: ({ content, chat, ref }) => {
      apiContext.message.all.setData(
        { chat: chatId },
        m => m && [...m, { id: ref, role: 'user', content, chatId: chat }]
      );
    },
    onSuccess: (resp, { ref }) => {
      apiContext.message.all.setData({ chat: chatId }, m => m && m.map(mm => (mm.id === ref ? resp : mm)));
    }
  });
  const onSubmit = (content: string) => {
    setContent('');
    sendMessage.mutate({ chat: chatId, content, ref: nanoid() });
  };

  useLayoutEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [chatId, data.length]);

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
