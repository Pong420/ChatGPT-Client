import { useUser } from '@/hooks/useUser';
import {
  createStyles,
  Navbar as MantineNavbar,
  TextInput,
  Code,
  UnstyledButton,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem
} from '@mantine/core';
import {
  IconBulb,
  IconUser,
  IconCheckbox,
  IconSearch,
  IconPlus,
  IconSelector,
  IconMessages,
  IconTrash,
  IconEdit
} from '@tabler/icons-react';
import { UserButton } from './UserButton';

const useStyles = createStyles(theme => ({
  navbar: {
    width: 300
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    '&:not(:last-of-type)': {
      borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
    }
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]}`
  },

  list: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md
  },

  listItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  itemContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },

  itemIcon: {
    marginRight: theme.spacing.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
  },

  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5)
  }
}));

const links = [
  { icon: IconBulb, label: 'Activity', notifications: 3 },
  { icon: IconCheckbox, label: 'Tasks', notifications: 4 },
  { icon: IconUser, label: 'Contacts' }
];

export function Navbar() {
  const { classes } = useStyles();
  const user = useUser();

  if (!user) return null;

  const mainLinks = links.map(link => (
    <div key={link.label} className={classes.listItem} onClick={console.log}>
      <div className={classes.itemContent}>
        <IconMessages size={20} className={classes.itemIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>

      <ActionIcon size={20} color="dark" onClick={event => event.stopPropagation()}>
        <IconEdit size="0.8rem" stroke={1.5} />
      </ActionIcon>

      <ActionIcon size={20} color="dark" onClick={event => event.stopPropagation()}>
        <IconTrash size="0.8rem" stroke={1.5} />
      </ActionIcon>
    </div>
  ));

  return (
    <MantineNavbar p="md" pt="0" className={classes.navbar}>
      <MantineNavbar.Section className={classes.section}>
        <UserButton name={user.name || ''} icon={<IconSelector size="0.9rem" stroke={1.5} />} />
      </MantineNavbar.Section>

      <TextInput
        placeholder="Search"
        size="xs"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        mb="sm"
      />

      <MantineNavbar.Section className={classes.section}>
        <Group className={classes.header} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Conversations
          </Text>
          <Tooltip label="Create conversation" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <div className={classes.list}>{mainLinks}</div>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
