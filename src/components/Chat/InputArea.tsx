import { type Ref, forwardRef, useState } from 'react';
import { ActionIcon, Textarea, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconBrandTelegram } from '@tabler/icons-react';

export interface InputAreaProps {
  waitingForReply?: boolean;
  onSubmit?: (content: string) => void;
}

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: theme.colors.dark[4]
  },
  send: {
    alignSelf: 'flex-end'
  }
}));

function InputAreaComponent({ onSubmit, waitingForReply, ...props }: InputAreaProps, ref: Ref<HTMLTextAreaElement>) {
  const { classes } = useStyles();
  const [content, setContent] = useInputState('');
  const [keysDown, setkeysDown] = useState<string[]>([]);

  const handleSubmit = () => {
    if (waitingForReply || !content) return;
    onSubmit?.(content);
    setContent('');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => [...k, event.key]);

    if (event.key === 'Enter' && !keysDown.includes('Shift')) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => k.filter(kk => kk !== event.key));
  };

  return (
    <Textarea
      {...props}
      classNames={{ input: classes.input }}
      autosize
      autoFocus
      minRows={1}
      maxRows={6}
      value={content}
      onChange={setContent}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      ref={ref}
      rightSection={
        <ActionIcon
          className={classes.send}
          color="dark"
          mb={8}
          mr={8}
          loading={waitingForReply}
          onClick={handleSubmit}
        >
          <IconBrandTelegram size={18} />
        </ActionIcon>
      }
    />
  );
}

export const InputArea = forwardRef(InputAreaComponent);
