import { type Ref, forwardRef, useState } from 'react';
import type { Chat as ChatData } from '@prisma/client';
import { ActionIcon, Textarea, type TextareaProps, createStyles } from '@mantine/core';
import { IconBrandTelegram } from '@tabler/icons-react';

export interface ChatProps {
  chat: ChatData;
}

export interface InputAreaProps extends Omit<TextareaProps, 'onSubmit' | 'value'> {
  onSubmit?: (content: string) => void;
  value?: string;
  loading?: boolean;
}

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: theme.colors.dark[4]
  },
  send: {
    alignSelf: 'flex-end'
  }
}));

function InputAreaComponent(
  { onSubmit, value = '', loading, ...props }: InputAreaProps,
  ref: Ref<HTMLTextAreaElement>
) {
  const { classes } = useStyles();
  const [keysDown, setkeysDown] = useState<string[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => [...k, event.key]);

    if (event.key === 'Enter' && !keysDown.includes('Shift')) {
      event.preventDefault();
      _onSubmit();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => k.filter(kk => kk !== event.key));
  };

  const _onSubmit = () => {
    if (loading) return;
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        _onSubmit();
      }}
    >
      <Textarea
        {...props}
        classNames={{ input: classes.input }}
        autosize
        autoFocus
        minRows={1}
        maxRows={6}
        value={value}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        ref={ref}
        rightSection={
          <ActionIcon className={classes.send} color="dark" mb={8} mr={8} onClick={_onSubmit} loading={loading}>
            <IconBrandTelegram size={18} />
          </ActionIcon>
        }
      />
    </form>
  );
}

export const InputArea = forwardRef(InputAreaComponent);
