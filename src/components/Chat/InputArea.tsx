import { type Ref, forwardRef, useState } from 'react';
import {
  createStyles,
  ActionIcon,
  Autocomplete,
  Textarea,
  type TextareaProps,
  type AutocompleteProps
} from '@mantine/core';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { IconBrandTelegram } from '@tabler/icons-react';
import { searchPrompts } from '@/utils/prompts';

export interface InputAreaProps {
  loading?: boolean;
  onSubmit?: (content: string) => void;
}

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: theme.colors.dark[4],
    minHeight: '44px'
  },
  send: {
    alignSelf: 'flex-end'
  }
}));

function InputAreaComponent({ onSubmit, loading }: InputAreaProps, ref: Ref<HTMLInputElement & HTMLTextAreaElement>) {
  const { classes } = useStyles();
  const [content, setContent] = useInputState('');
  const [keysDown, setkeysDown] = useState<string[]>([]);
  const [dropdownMenuOpen, handleDropdownMenu] = useDisclosure(false);
  const useAutoComplete = content.startsWith('/') && !content.includes('\n');

  const handleSubmit = () => {
    if (loading || !content) return;
    onSubmit?.(content);
    setContent('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => [...k, event.key]);

    if (event.key === 'Enter' && !keysDown.includes('Shift') && !dropdownMenuOpen) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;
    setkeysDown(k => k.filter(kk => kk !== event.key));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const data = clipboardData?.getData('Text');
    const start = event.currentTarget.selectionStart || 0;
    const end = event.currentTarget.selectionEnd || 0;
    setContent(`${content.slice(0, start)}${data?.trim() || ''}${content.slice(end)}`);
  };

  const handleBlur = () => setkeysDown([]);

  const rightSection = (
    <ActionIcon className={classes.send} color="dark" mb={8} mr={8} loading={loading} onClick={handleSubmit}>
      <IconBrandTelegram size={18} />
    </ActionIcon>
  );

  const inputProps: Partial<AutocompleteProps> & Partial<TextareaProps> = {
    classNames: { input: classes.input },
    autoFocus: true,
    value: content,
    onChange: setContent,
    onBlur: handleBlur,
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    rightSection
  };

  const promtps = useAutoComplete
    ? // the empty space anims to trigger prompts
      searchPrompts(content.replace(/^\//, '') || ' ')
    : [];

  return useAutoComplete ? (
    <Autocomplete
      {...inputProps}
      data={promtps}
      dropdownPosition="top"
      filter={() => true}
      onDropdownOpen={handleDropdownMenu.open}
      onDropdownClose={handleDropdownMenu.close}
      ref={ref}
    />
  ) : (
    <Textarea {...inputProps} autosize minRows={1} maxRows={6} ref={ref} />
  );
}

export const InputArea = forwardRef(InputAreaComponent);
