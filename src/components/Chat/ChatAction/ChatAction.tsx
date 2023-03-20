import { ActionIcon, type ActionIconProps } from '@mantine/core';
import { type TablerIconsProps } from '@tabler/icons-react';

export interface ChatActionProps extends ActionIconProps {
  icon: React.ComponentType<TablerIconsProps>;
  onClick(): void;
}

export function ChatAction({ icon: Icon, onClick, ...props }: ChatActionProps) {
  return (
    <ActionIcon
      {...props}
      size={20}
      color="dark"
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon size="0.8rem" stroke={1.5} />
    </ActionIcon>
  );
}
