import { api } from '@/utils/api';
import { Modal, Stack, type ModalProps, Button, TextInput, PasswordInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock, IconUserPlus } from '@tabler/icons-react';

export function CreateUserModal(props: ModalProps) {
  const form = useForm({
    initialValues: {
      email: 'samfunghp@gmail.com',
      password: '12345678'
    }
  });

  const createUser = api.admin.createUser.useMutation();

  const onSubmit = form.onSubmit(values => void createUser.mutate(values));

  return (
    <Modal
      {...props}
      centered
      padding={24}
      title={
        <Group spacing={5}>
          <IconUserPlus size="1.2rem" />
          Create User
        </Group>
      }
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={20}>
          <TextInput
            required
            icon={<IconAt size="1rem" />}
            label="Email"
            placeholder="Email"
            {...form.getInputProps('email')}
            error={form.errors.email && 'Invalid Email'}
          />

          <PasswordInput
            required
            icon={<IconLock size="1rem" />}
            label="Password"
            placeholder="Password"
            autoComplete="new-password"
            {...form.getInputProps('password')}
            error={form.errors.password && 'Password should include at least 6 characters'}
          />

          <Button type="submit" disabled={createUser.isLoading}>
            Create
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
