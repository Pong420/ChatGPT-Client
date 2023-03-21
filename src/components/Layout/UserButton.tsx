import { UnstyledButton, type UnstyledButtonProps, Group, Avatar, Text, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight } from '@tabler/icons-react';
import { MainMenu } from '../MainMenu';

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

export function UserButton({ image, name, icon, ...props }: UserButtonProps) {
  const { classes } = useStyles();
  const [menuOpened, menuCtrl] = useDisclosure();

  return (
    <>
      <UnstyledButton className={classes.user} onClick={menuCtrl.open} {...props}>
        <Group spacing={10}>
          <Avatar src={image} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>
          </div>

          {icon || <IconChevronRight size="0.9rem" />}
        </Group>
      </UnstyledButton>
      <MainMenu opened={menuOpened} onClose={menuCtrl.close} />
    </>
  );
}
