import Head from 'next/head';
import { api } from '@/utils/api';
import { Stack, createStyles, rem } from '@mantine/core';
import type { Chat as ChatData } from '@prisma/client';
import { useNavigate } from '@/hooks/useNavigate';
import { DeleteChat } from './ChatAction';
import { getChatIcon } from './getChatIcon';

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

function ChatItem({ chat: c }: { chat: ChatData }) {
  const { classes } = useStyles();
  const { router, pathname, active } = useNavigate(`/chat/${c.id}`);
  const title = c.title || c.system || 'Conversation';
  const Icon = getChatIcon(c.system);

  return (
    <div
      className={`${classes.listItem} ${active ? classes.listItemActive : ''}`.trim()}
      onClick={() => {
        router.push({ pathname }).catch(() => void 0);
      }}
    >
      {active && (
        <Head>
          <title>{title} | ChatGPT</title>
        </Head>
      )}
      <div className={classes.itemContent}>
        <Icon size={20} className={classes.itemIcon} stroke={1.5} />
        {c.title || c.system || 'Conversation'}
      </div>

      {/* <EditChat chat={c} /> */}
      <DeleteChat chat={c} />
    </div>
  );
}

export function ChatList() {
  const { classes } = useStyles();
  const chats = api.chat.all.useQuery();
  const data = chats.data || [];

  return (
    <Stack className={classes.list} spacing={5}>
      {data.map(c => (
        <ChatItem key={c.id} chat={c} />
      ))}
    </Stack>
  );
}
