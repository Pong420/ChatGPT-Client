import { nanoid } from 'nanoid';
import { Text, Center, Container, Stack, createStyles } from '@mantine/core';
import { api } from '@/utils/api';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import { useReply } from '@/hooks/useReply';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
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
    position: 'sticky',
    bottom: '0',
    width: '100%',
    padding: `${theme.spacing.md} 0`,
    background: `linear-gradient(to bottom, ${theme.fn.rgba(theme.colors.dark[9], 0.1)} 0%, ${
      theme.colors.dark[9]
    } 200%)`
  }
}));

export function Chat({ chatId }: ChatProps) {
  const { classes } = useStyles();

  const context = api.useContext();

  const messages = api.message.all.useQuery({ chatId }, { refetchIntervalInBackground: false });
  const data = messages.data || [];

  const sendMessage = api.message.send.useMutation({
    onMutate: ({ content, chatId, ref }) => {
      // insert user question to the messages list
      context.message.all.setData(
        { chatId },
        m => m && [...m, { id: ref, role: ChatCompletionRequestMessageRoleEnum.User, content, chatId, usage: null }]
      );
    },
    onSuccess: ({ question, reply }, { ref }) => {
      // update user question and add chat-gpt reply
      context.message.all.setData({ chatId }, m => m && m.map(n => (n.id === ref ? question : n)).concat(reply));
    }
  });

  const reply = useReply(sendMessage.isLoading ? chatId : '');

  const handleSendMessage = (content: string) => {
    sendMessage.mutate({ chatId, content, ref: nanoid() });
  };

  useScrollToBottom({
    // scroll to bottom on new message or reply update
    smooth: [data.length, reply.message.content],
    // scroll to bottom immediately when all messages loaded
    instant: [messages.isSuccess]
  });

  return (
    <Stack className={classes.root} spacing={0}>
      <div className={classes.messages}>
        {data.length ? (
          <>
            {data.map((m, idx) => (
              <ChatMessage key={idx} message={m} />
            ))}
            {sendMessage.isLoading && <ChatMessage typing message={reply.message} />}
          </>
        ) : (
          messages.isSuccess && (
            <Center h="100%">
              <Text align="center" fw="bold">
                No messages exist. Let&apos;s start by asking your first question
              </Text>
            </Center>
          )
        )}
      </div>
      <div className={classes.gradient}>
        <Container>
          <InputArea waitingForReply={sendMessage.isLoading} onSubmit={handleSendMessage} />
        </Container>
      </div>
    </Stack>
  );
}
