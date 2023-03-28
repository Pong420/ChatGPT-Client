import { Avatar, Container, Group, createStyles, keyframes, px, rem } from '@mantine/core';
import type { Message } from '@prisma/client';
import { Markdown } from '@/components/Markdown';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import ChatGPTIcon from '@/assets/chatgpt.svg';

export interface ChatMessageProps {
  message?: Message;
  typing?: boolean;
}

const blink = keyframes({
  '0%': { opacity: 1.0 },
  '50%': { opacity: 0.0 },
  '100%': { opacity: 1.0 }
});

const useStyles = createStyles(theme => {
  return {
    root: {
      padding: `0 ${theme.spacing.md}`
    },
    content: {
      position: 'relative'
    },
    avatar: {
      flex: '0 0 auto',
      display: 'flex',
      alignSelf: 'flex-start',
      alignItems: 'center',
      height: `5.55rem`
    },
    cursor: {
      backgroundColor: theme.fn.darken(theme.colors.dark[3], 0.2),
      animation: `${blink} 1s step-end infinite`,
      display: 'inline-block',
      width: '0.7rem',
      height: `calc(${theme.lineHeight || '1'}rem - 6px)`,
      transform: `translate(0.3rem, 0.25rem)`
    },
    message: {
      overflow: 'hidden',
      width: `100%`
    }
  };
});

const chatgptIconSize = `1.4em`;

export function ChatMessage({ message, typing }: ChatMessageProps) {
  const { classes } = useStyles();
  const cursor = typing && <span className={classes.cursor} />;

  return (
    <div className={classes.root}>
      <Container>
        <Group mx="auto" noWrap>
          <div className={classes.avatar}>
            {message?.role === ChatCompletionRequestMessageRoleEnum.User ? (
              <Avatar />
            ) : (
              <Avatar>
                <ChatGPTIcon width={chatgptIconSize} height={chatgptIconSize} />
              </Avatar>
            )}
          </div>

          <Container className={classes.message} py="md" px="0">
            {message?.content ? <Markdown content={message.content} cursor={cursor} /> : cursor}
          </Container>

          <div style={{ width: 40 }}></div>
        </Group>
      </Container>
    </div>
  );
}
