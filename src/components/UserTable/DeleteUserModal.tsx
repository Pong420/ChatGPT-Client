import { Group, Text, Button, Modal, type ModalProps } from '@mantine/core';
import { IconUserMinus } from '@tabler/icons-react';
import { api } from '@/utils/api';
import type { User } from '@prisma/client';

export interface DeleteUserModalprops extends ModalProps {
  user: Pick<User, 'id' | 'email' | 'name'>;
}

export function DeleteUserModal({ user, ...props }: DeleteUserModalprops) {
  const context = api.useContext();
  const deleteUser = api.admin.deleteUser.useMutation({
    onSuccess: user => {
      props.onClose();
      context.admin.getUsers.setData(undefined, users => users && users.filter(u => u.id !== user.id));
    }
  });

  return (
    <Modal
      {...props}
      title={
        <Group spacing={5}>
          <IconUserMinus fontSize="1rem" />
          <Text fz="md" fw={500}>
            Delete User
          </Text>
        </Group>
      }
    >
      <Text c="dimmed" fz="sm">
        This action <b>cannot</b> be undone. This will permanently delete the user <b>{user.email}</b> account.
      </Text>

      <Button
        fullWidth
        color="red"
        mt="lg"
        loading={deleteUser.isLoading}
        onClick={() => deleteUser.mutate({ id: user.id })}
      >
        Delete
      </Button>
    </Modal>
  );
}
