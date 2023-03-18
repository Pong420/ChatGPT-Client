import { Modal, Stack, type ModalProps, Button, TextInput, PasswordInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock, IconUser, IconUserPlus } from '@tabler/icons-react';

interface UserModalFields {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserModalProps extends Omit<ModalProps, 'onSubmit'> {
  initialValues?: UserModalFields;
  isLoading?: boolean;
  onSubmit?: (payload: Required<UserModalFields>) => void;
}

export function UserModal({ title, initialValues, isLoading, onSubmit, ...props }: UserModalProps) {
  const form = useForm({
    initialValues
  });

  const _onSubmit = form.onSubmit(values => onSubmit?.(values as Required<UserModalFields>));

  return (
    <Modal
      {...props}
      centered
      padding={24}
      title={
        <Group spacing={5}>
          <IconUserPlus size="1.2rem" />
          {title}
        </Group>
      }
    >
      <form onSubmit={_onSubmit}>
        <Stack spacing={20}>
          <TextInput
            required
            icon={<IconUser size="1rem" />}
            label="Name"
            placeholder="Name"
            {...form.getInputProps('name')}
          />

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

          <Button type="submit" loading={isLoading}>
            Create
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
