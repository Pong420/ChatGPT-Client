import { type Ref, forwardRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { ActionIcon, Textarea, createStyles } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconBrandTelegram } from '@tabler/icons-react';
import { api } from '@/utils/api';
import { ChatCompletionRequestMessageRoleEnum } from '@/utils/openai';

export interface InputAreaProps {
  chatId: string;
  onLoad?: (isLoading: boolean) => void;
}

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: theme.colors.dark[4]
  },
  send: {
    alignSelf: 'flex-end'
  }
}));

function InputAreaComponent({ chatId, onLoad, ...props }: InputAreaProps, ref: Ref<HTMLTextAreaElement>) {
  const { classes } = useStyles();
  const [content, setContent] = useInputState('');
  const [keysDown, setkeysDown] = useState<string[]>([]);

  const context = api.useContext();

  const sendMessage = api.message.send.useMutation({
    onMutate: ({ content, chat, ref }) => {
      // add user message to list
      context.message.all.setData(
        { chat: chatId },
        m => m && [...m, { id: ref, role: ChatCompletionRequestMessageRoleEnum.User, content, chatId: chat }]
      );
      onLoad?.(true);
    },
    onSuccess: ({ question, reply }, { ref }) => {
      // update user message and add chat gpt reply
      context.message.all.setData(
        { chat: chatId },
        m => m && m.map(mm => (mm.id === ref ? question : mm)).concat(reply)
      );
      onLoad?.(false);
    }
  });

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
    if (sendMessage.isLoading || !content) return;
    sendMessage.mutate({ chat: chatId, content, ref: nanoid() });
    setContent('');
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
          onClick={_onSubmit}
          loading={sendMessage.isLoading}
        >
          <IconBrandTelegram size={18} />
        </ActionIcon>
      }
    />
  );
}

export const InputArea = forwardRef(InputAreaComponent);
