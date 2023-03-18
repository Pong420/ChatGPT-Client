import { useMemo, useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Title
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { useInputState } from '@mantine/hooks';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconUsers } from '@tabler/icons-react';
import type { User } from '@prisma/client';
import { DeleteUser } from './DeleteUser';
import { CreateUser } from './CreateUser';

type UserData = Pick<User, 'id' | 'name' | 'email' | 'image'>;

export interface UserTableProps {
  data: UserData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const useStyles = createStyles(theme => ({
  th: {
    padding: '0 !important'
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21)
  }
}));

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: UserData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter(item => keys(data[0]).some((key: keyof UserData) => item[key]?.toLowerCase().includes(query)));
}

function sortData(data: UserData[], payload: { sortBy: keyof UserData | null; reversed: boolean; search: string }) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aa = a[sortBy];
      const bb = b[sortBy];

      if (!aa || !bb) return 0;

      if (payload.reversed) {
        return bb.localeCompare(aa);
      }

      return aa.localeCompare(bb);
    }),
    payload.search
  );
}

export function UserTable({ data }: UserTableProps) {
  const [search, setSearch] = useInputState('');
  const [sort, setSort] = useState({ by: null as keyof UserData | null, reverse: false });

  const setSorting = (field: keyof UserData) => {
    setSort(s => ({ ...s, by: field, reverse: field === s.by ? !s.reverse : false }));
  };

  const sortedData = useMemo(
    () => sortData(data, { sortBy: sort.by, reversed: sort.reverse, search }),
    [sort, search, data]
  );

  const rows = sortedData.map(user => (
    <tr key={user.name || user.email}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <DeleteUser user={user} />
      </td>
    </tr>
  ));

  return (
    <>
      <Group position="apart" mb={20}>
        <Group spacing={5}>
          <IconUsers fontSize={24} />
          <Title size={24}>Users</Title>
        </Group>
        <CreateUser />
      </Group>

      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={setSearch}
        />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <Th sorted={sort.by === 'name'} reversed={sort.reverse} onSort={() => setSorting('name')}>
                Name
              </Th>
              <Th sorted={sort.by === 'email'} reversed={sort.reverse} onSort={() => setSorting('email')}>
                Email
              </Th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={3}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
