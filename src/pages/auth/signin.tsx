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
import { signIn } from 'next-auth/react';
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
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rembmer: true
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

        <Text size="xl" weight={700} mt={20}>
          Welcome to back
        </Text>

        <Text mt={30} size="xs">
          Sign in with
        </Text>

        <Group grow spacing={5} mt={10}>
          <SocialButton>
            <IconBrandGoogle />
          </SocialButton>

          <SocialButton>
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
            />

            <PasswordInput
              required
              icon={<IconLock size="1rem" />}
              name="password"
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              error={form.errors.password && 'Password should include at least 6 characters'}
            />

            <Checkbox label="Remember me" />

            <Button type="submit">Sign In</Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
