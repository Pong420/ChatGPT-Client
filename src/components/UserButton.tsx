import { UnstyledButton, type UnstyledButtonProps, Group, Avatar, Text, createStyles } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import ChatGPTIcon from '@/assets/chatgpt.svg';

const useStyles = createStyles(theme => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    }
  }
}));

interface UserButtonProps extends UnstyledButtonProps {
  image?: string;
  name: string;
  icon?: React.ReactNode;
}

export function UserButton({ image, name, icon, ...others }: UserButtonProps) {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group spacing={10}>
        <Avatar src={image} radius="xl">
          {!image && (
            <span style={{ fontSize: 24 }}>
              <ChatGPTIcon />
            </span>
          )}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>
        </div>

        {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
}
