import { useState } from 'react';
import type { Chat as ChatData } from '@prisma/client';
import { ActionIcon, Textarea, type TextareaProps, createStyles } from '@mantine/core';
import { IconBrandTelegram } from '@tabler/icons-react';

export interface ChatProps {
  chat: ChatData;
}

export interface InputAreaProps extends Omit<TextareaProps, 'onSubmit' | 'value'> {
  onSubmit?: (content: string) => void;
  value?: string;
}

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: theme.colors.dark[4]
  },
  send: {
    alignSelf: 'flex-end'
  }
}));

export function InputArea({ onSubmit, value = '', ...props }: InputAreaProps) {
  const { classes } = useStyles();
  const [keysDown, setkeysDown] = useState<string[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => [...k, event.key]);

    if (event.key === 'Enter' && !keysDown.includes('Shift')) {
      event.preventDefault();
      onSubmit?.(value);
    }
  };

  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => k.filter(kk => kk !== event.key));
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Textarea
        {...props}
        classNames={{ input: classes.input }}
        autosize
        autoFocus
        minRows={1}
        maxRows={6}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        rightSection={
          <ActionIcon className={classes.send} color="dark" mb={8} mr={8} onClick={() => onSubmit?.(value)}>
            <IconBrandTelegram size={18} />
          </ActionIcon>
        }
      />
    </form>
  );
}
