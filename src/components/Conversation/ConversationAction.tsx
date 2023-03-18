import { api } from '@/utils/api';
import { ActionIcon, type ActionIconProps } from '@mantine/core';
import type { Conversation } from '@prisma/client';
import { IconPlus, IconEdit, IconTrash, type TablerIconsProps } from '@tabler/icons-react';

export interface ConversationActionProps extends ActionIconProps {
  icon: React.ComponentType<TablerIconsProps>;
  onClick(): void;
}

export interface BasicConversationActionProps {
  conversation: Conversation;
}

export function ConversationAction({ icon: Icon, onClick, ...props }: ConversationActionProps) {
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

export function CreateConversation() {
  const context = api.useContext();
  const create = api.conversation.create.useMutation({
    onSuccess: conversation => context.conversation.all.setData(undefined, c => c && [...c, conversation])
  });
  return <ConversationAction icon={IconPlus} onClick={() => create.mutate({})} loading={create.isLoading} />;
}

export function EditConversation({}: BasicConversationActionProps) {
  return <ConversationAction icon={IconEdit} onClick={() => void 0} />;
}

export function DeleteConveration({ conversation }: BasicConversationActionProps) {
  const context = api.useContext();
  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: conversation =>
      context.conversation.all.setData(undefined, c => c && c.filter(c => c.id !== conversation.id))
  });
  return (
    <ConversationAction
      icon={IconTrash}
      onClick={() => deleteConversation.mutate({ id: conversation.id })}
      loading={deleteConversation.isLoading}
    />
  );
}
