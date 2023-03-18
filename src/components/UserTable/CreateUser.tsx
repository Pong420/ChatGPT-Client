import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { api } from '@/utils/api';
import { UserModal } from './UserModal';

export function CreateUser() {
  const [opened, control] = useDisclosure();
  const createUser = api.admin.createUser.useMutation({ onSuccess: control.close });

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
