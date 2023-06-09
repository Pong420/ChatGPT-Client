import { useState } from 'react';
import { default as router } from 'next/router';
import { signIn } from 'next-auth/react';
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
  Group,
  Center,
  type ButtonProps
} from '@mantine/core';
import { notifications } from '@/utils/notifications';
import { IconBrandGoogle, IconBrandGithub, IconAt, IconLock } from '@tabler/icons-react';
import ChatGPTIcon from '@/assets/chatgpt.svg';

function SocialButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      styles={theme => {
        const [backgroundColor, color] =
          theme.colorScheme === 'dark' ? [theme.colors.dark[3], '#fff'] : [theme.colors.gray[3], '#000'];
        return {
          root: {
            height: 40,
            color,
            backgroundColor,
            '&:not([data-disabled])': theme.fn.hover({
              backgroundColor: theme.fn.darken(backgroundColor, 0.05)
            }) as string
          }
        };
      }}
    />
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rembmer: true
    },

    validate: {}
  });

  const handleSignIn = async (values: typeof form.values) => {
    setLoading(true);
    const resp = await signIn('credentials', { ...values, redirect: false, callbackUrl: window.location.origin });
    if (resp?.ok) {
      await router.push('/');
    } else {
      notifications.error(resp?.error || 'Error');
    }
    setLoading(false);
  };

  const onSubmit = form.onSubmit(values => void handleSignIn(values));

  return (
    <Center mx="auto" h="100%">
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
          <SocialButton disabled={loading}>
            <IconBrandGoogle />
          </SocialButton>

          <SocialButton disabled={loading}>
            <IconBrandGithub />
          </SocialButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              required
              icon={<IconAt size="1rem" />}
              name="email"
              label="Email"
              placeholder="Email"
              {...form.getInputProps('email')}
              error={form.errors.email && 'Invalid Email'}
              disabled={loading}
            />

            <PasswordInput
              required
              icon={<IconLock size="1rem" />}
              name="password"
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              error={form.errors.password && 'Password should include at least 6 characters'}
              disabled={loading}
            />

            <Checkbox label="Remember me" />

            <Button type="submit" loading={loading}>
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
