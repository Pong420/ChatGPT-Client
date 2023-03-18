import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DeleteUserModal, type DeleteUserModalprops } from './DeleteUserModal';

export interface DeleteUserprops {
  user: DeleteUserModalprops['user'];
}

export function DeleteUser({ user }: DeleteUserprops) {
  const [opened, control] = useDisclosure();

  return (
    <>
      <ActionIcon onClick={control.open} color="red">
        <IconTrash size="1rem" />
      </ActionIcon>
      <DeleteUserModal user={user} opened={opened} onClose={control.close} />
    </>
  );
}
