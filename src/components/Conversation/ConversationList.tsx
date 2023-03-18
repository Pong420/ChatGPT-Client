import { api, isMessages } from '@/utils/api';
import { Stack, createStyles, rem } from '@mantine/core';
import { IconMessages } from '@tabler/icons-react';
import type { Conversation as ConversationData } from '@prisma/client';
import { useNavigate } from '@/hooks/useNavigate';
import { DeleteConveration, EditConversation } from './ConversationAction';

const useStyles = createStyles(theme => ({
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
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  listItemActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    color: theme.colorScheme === 'dark' ? theme.white : theme.black
  },

  itemContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },

  itemIcon: {
    marginRight: theme.spacing.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
  }
}));

function ConversationItem({ conversation: c }: { conversation: ConversationData }) {
  const messages = c.messages;

  if (!isMessages(messages)) {
    throw new Error('bad implementation');
  }

  const { classes } = useStyles();
  const { router, pathname, active } = useNavigate(`/conversation/${c.id}`);
  const title = messages?.[0]?.content || 'Conversation';

  return (
    <div
      className={`${classes.listItem} ${active ? classes.listItemActive : ''}`.trim()}
      onClick={() => {
        router.push({ pathname }).catch(() => void 0);
      }}
    >
      <div className={classes.itemContent}>
        <IconMessages size={20} className={classes.itemIcon} stroke={1.5} />
        {title}
      </div>

      <EditConversation conversation={c} />
      <DeleteConveration conversation={c} />
    </div>
  );
}

export function ConversationList({}) {
  const { classes } = useStyles();
  const conversations = api.conversation.all.useQuery();
  const data = conversations.data || [];

  return (
    <Stack className={classes.list} spacing={5}>
      {data.map(c => (
        <ConversationItem key={c.id} conversation={c} />
      ))}
    </Stack>
  );
}
