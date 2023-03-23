import { useMemo } from 'react';
import { remark } from 'remark';
import type { Content } from 'mdast';
import { Avatar, Container, Group, Code, createStyles, keyframes, px } from '@mantine/core';
import type { Message } from '@prisma/client';
import { Prism, type PrismProps } from '@mantine/prism';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';
import ChatGPTIcon from '@/assets/chatgpt.svg';

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
      flex: '0 1 auto',
      width: `100%`
    }
  };
});

const chatgptIconSize = `1.4em`;

export function astToRectNode(payload: Content | Content[], data: React.ReactNode[] = []) {
  if (Array.isArray(payload)) {
    payload.forEach(t => astToRectNode(t, data));
  } else if ('children' in payload) {
    astToRectNode(payload.children, data);
  } else if ('value' in payload) {
    const key = data.length;

    if (payload.type === 'code') {
      data.push(
        <Prism key={Math.random()} my="sm" language={payload.lang as PrismProps['language']}>
          {payload.value}
        </Prism>
      );
    } else if (payload.type === 'inlineCode') {
      data.push(
        <Code key={key} color="red" fz="md">
          {payload.value}
        </Code>
      );
    } else {
      data.push(<span key={key}>{payload.value}</span>);
    }
  }
  return data;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { classes } = useStyles();

  const content = useMemo(() => {
    const ast = remark.parse(message?.content || '');
    return astToRectNode(ast.children, []);
  }, [message?.content]);

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
          <div className={classes.message}>{message ? content : <div className={classes.cursor} />}</div>
        </Group>
      </Container>
    </div>
  );
}
