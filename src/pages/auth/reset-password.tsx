import { useForm } from '@mantine/form';
import { PasswordInput, Text, Paper, Button, Stack, Group, Center } from '@mantine/core';
import { signIn } from 'next-auth/react';
import { IconLock } from '@tabler/icons-react';
import ChatGPTIcon from '@/assets/chatgpt.svg';

export default function ResetPasswordPage() {
  const form = useForm({
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    },

    validate: {}
  });

  const onSubmit = form.onSubmit(
    values => void signIn('credentials', { ...values, callbackUrl: 'http://localhost:3000/' })
  );

  return (
    <Center mx="auto" h="100%">
      <Paper withBorder shadow="md" w="100%" p={30} maw={420} radius="md">
        <Group spacing={5}>
          <ChatGPTIcon />
          <Text size="sm" weight={500}>
            ChatGPT
          </Text>
        </Group>

        <Text size="xl" weight={700} my={20}>
          Reset Password
        </Text>

        <form onSubmit={onSubmit}>
          <Stack>
            <PasswordInput
              icon={<IconLock size="1rem" />}
              required
              label="Password"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              icon={<IconLock size="1rem" />}
              required
              autoComplete="new-password"
              label="New Password"
              {...form.getInputProps('newPassword')}
            />
            <PasswordInput
              icon={<IconLock size="1rem" />}
              required
              autoComplete="new-password"
              label="Confirm New Password"
              {...form.getInputProps('confirmNewPassword')}
            />

            <Button type="submit">Reset</Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
