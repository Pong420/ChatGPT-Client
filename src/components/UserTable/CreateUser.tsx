import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { api } from '@/utils/api';
import { UserModal } from './UserModal';
import type { User } from '@prisma/client';

export function CreateUser() {
  const context = api.useContext();
  const [opened, control] = useDisclosure();
  const createUser = api.admin.createUser.useMutation({
    onSuccess: user => {
      control.close();
      context.admin.getUsers.setData(undefined, users => users && [...users, user as User]);
    }
  });

  return (
    <>
      <Button leftIcon={<IconPlus size="1rem" />} onClick={control.open}>
        New User
      </Button>
      <UserModal
        title="Create User"
        opened={opened}
        isLoading={createUser.isLoading}
        onSubmit={createUser.mutate}
        onClose={control.close}
      />
    </>
  );
}
