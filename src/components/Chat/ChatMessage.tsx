import { Avatar, Container, Group, createStyles, keyframes, px } from '@mantine/core';
import type { Message } from '@prisma/client';

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
    }
  };
});

export function ChatMessage({ message }: ChatMessageProps) {
  const { classes } = useStyles();

  return (
    <div>
      <Container>
        <Group py="lg" m="auto">
          <Avatar />
          <div>{message ? message.content : <div className={classes.cursor} />}</div>
        </Group>
      </Container>
    </div>
  );
}
