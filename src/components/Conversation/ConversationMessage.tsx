import { type ChatGPTMessage } from '@/utils/api';
import { Avatar, Container, Group } from '@mantine/core';

export interface ConversationMessageProps {
  message: ChatGPTMessage;
}

export function ConversationMessage({ message }: ConversationMessageProps) {
  return (
    <div>
      <Container>
        <Group py="lg" m="auto" noWrap maw={1000}>
          <Avatar />
          <div>{message.content}</div>
        </Group>
      </Container>
    </div>
  );
}
