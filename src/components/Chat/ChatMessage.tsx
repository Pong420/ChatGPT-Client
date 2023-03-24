import { Avatar, Container, Group, createStyles, keyframes, px } from '@mantine/core';
import type { Message } from '@prisma/client';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import ChatGPTIcon from '@/assets/chatgpt.svg';
import { Markdown } from '../Markdown';

export interface ChatMessageProps {
  message?: Message;
}

const blink = keyframes({
  '0%': { opacity: 1.0 },
  '50%': { opacity: 0.0 },
  '100%': { opacity: 1.0 }
});

const useStyles = createStyles(theme => {
  return {
    content: {
      position: 'relative'
    },
    cursor: {
      width: '1em',
      height: px(theme.lineHeight) * px(theme.fontSizes.md),
      backgroundColor: theme.fn.darken(theme.colors.dark[3], 0.2),
      animation: `${blink} 1s step-end infinite`
    },
    message: {
      overflow: 'hidden',
      // flex: '0 1 auto',
      width: `100%`
    }
  };
});

const chatgptIconSize = `1.4em`;

export function ChatMessage({ message }: ChatMessageProps) {
  const { classes } = useStyles();

  return (
    <div>
      <Container>
        <Group py="lg" m="auto" noWrap>
          {message?.role === ChatCompletionRequestMessageRoleEnum.User ? (
            <Avatar />
          ) : (
            <Avatar>
              <ChatGPTIcon width={chatgptIconSize} height={chatgptIconSize} />
            </Avatar>
          )}
          <div className={classes.message}>
            {message?.content ? <Markdown content={message.content} /> : <div className={classes.cursor} />}
          </div>
        </Group>
      </Container>
    </div>
  );
}
