import { useUser } from '@/hooks/useUser';
import { createStyles, Navbar as MantineNavbar, Text, Group, rem } from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import { UserButton } from './UserButton';
import { ConversationList } from '../Conversation/ConversationList';
import { CreateConversation } from '../Conversation/ConversationAction';

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

  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5)
  }
}));

export function Navbar() {
  const { classes } = useStyles();
  const user = useUser();

  if (!user) return null;

  return (
    <MantineNavbar p="md" pt="0" className={classes.navbar}>
      <MantineNavbar.Section className={classes.section}>
        <UserButton name={user.name || ''} icon={<IconSelector size="0.9rem" stroke={1.5} />} />
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.section}>
        <Group className={classes.header} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Conversations
          </Text>

          <CreateConversation />
        </Group>

        <ConversationList />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
