import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Button,
  Divider,
  Checkbox,
  Stack,
  Container,
  Group,
  type ButtonProps,
  Center
} from '@mantine/core';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import ChatGPTIcon from '@/assets/chatgpt.svg';

function SocialButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      styles={theme => {
        const color = '#e9e9e9';
        return {
          root: {
            backgroundColor: '#e9e9e9',
            height: 40,
            '&:not([data-disabled])': theme.fn.hover({
              backgroundColor: theme.fn.darken(color, 0.05)
            }) as string
          }
        };
      }}
    />
  );
}

export default function LoginPage() {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      rembmer: true
    },

    validate: {
      password: val => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
    }
  });

  return (
    <Center mx="auto" h="100%" bg="#f9f9f9">
      <Paper withBorder shadow="md" w="100%" p={30} maw={420} radius="md">
        <Group spacing={5}>
          <ChatGPTIcon />
          <Text size="sm" weight={500}>
            ChatGPT
          </Text>
        </Group>

        <Text size="xl" weight={700} mt={20}>
          Welcome to back
        </Text>

        <Text mt={30} size="xs">
          Sign in with
        </Text>

        <Group grow spacing={5} mt={10}>
          <SocialButton>
            <IconBrandGoogle color="#000" />
          </SocialButton>

          <SocialButton>
            <IconBrandGithub color="#000" />
          </SocialButton>
        </Group>

        <Divider label="Or continue with username" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => void 0)}>
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="hello@mantine.dev"
              value={form.values.username}
              onChange={event => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username && 'Invalid username'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={event => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            <Checkbox label="Remember me" />

            <Button type="submit">Sign In</Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
