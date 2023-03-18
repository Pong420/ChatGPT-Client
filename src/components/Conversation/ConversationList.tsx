import { api, isMessages } from '@/utils/api';
import { createStyles, rem } from '@mantine/core';
import { IconMessages } from '@tabler/icons-react';
import { DeleteConveration, EditConversation } from './ConversationAction';
import Link from 'next/link';

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

export function ConversationList({}) {
  const { classes } = useStyles();
  const conversations = api.conversation.all.useQuery();
  const data = conversations.data || [];

  return (
    <div className={classes.list}>
      {data.map((c, i) => {
        const messages = c.messages;
        if (!isMessages(messages)) return null;

        const title = messages?.[0]?.content || 'Conversation';

        return (
          <Link key={i} href={`/conversation/${c.id}`}>
            <div className={classes.listItem}>
              <div className={classes.itemContent}>
                <IconMessages size={20} className={classes.itemIcon} stroke={1.5} />
                {title}
              </div>

              <EditConversation conversation={c} />
              <DeleteConveration conversation={c} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
