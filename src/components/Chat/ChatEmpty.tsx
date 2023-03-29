import { Text, Center, Title, Container } from '@mantine/core';

export interface ChatEmptyProps {
  system?: string | null;
}

export function PromptSuggestion() {
  return (
    <>
      <Title>Welcome to ChatGPT</Title>
      <Text color="dimmed">This is unoffical ChatGPT web client</Text>
      <Text mt="lg" fz="lg">
        You may begin by asking your first question or input a &quot;/&quot; to select and set the behavior of the
        assistant.
      </Text>
    </>
  );
}

export function SystemSuggestion({ system }: { system: string }) {
  return (
    <>
      <Title>I am {system}</Title>
      <Text fz="md">How can I assist you?</Text>
    </>
  );
}

export function ChatEmpty({ system }: ChatEmptyProps) {
  return (
    <Center h="100%">
      <Container px="lg">{system ? <SystemSuggestion system={system} /> : <PromptSuggestion />}</Container>
    </Center>
  );
}
