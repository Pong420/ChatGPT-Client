import { Avatar, Container, Group } from '@mantine/core';
import type { Message } from '@prisma/client';

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div>
      <Container>
        <Group py="lg" m="auto">
          <Avatar />
          <div>{message.content}</div>
        </Group>
      </Container>
    </div>
  );
}
