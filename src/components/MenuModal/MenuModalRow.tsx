import { Flex, Group, Text, createStyles } from '@mantine/core';
import { IconChevronRight, type TablerIconsProps } from '@tabler/icons-react';
import { getMenuColors } from './MenuModal';

export interface MenuModalRowProps {
  icon?: React.ComponentType<TablerIconsProps>;
  title: string;
  text?: string;
  rightSection?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const useStyles = createStyles(theme => {
  const [, backgroundColor] = getMenuColors(theme.colorScheme);
  return {
    root: {
      backgroundColor
    },
    interactive: {
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: theme.fn.rgba(theme.fn.lighten(backgroundColor, 0.5), 0.3)
      }
    }
  };
});

export function MenuModalRow({ icon: Icon, title, text, rightSection, onClick }: MenuModalRowProps) {
  const { classes, cx } = useStyles();

  if (!!onClick && !rightSection) {
    rightSection = <IconChevronRight fontSize="1rem" />;
  }

  return (
    <Flex
      className={cx(classes.root, { [classes.interactive]: !!onClick })}
      w="100%"
      h="60px"
      px="lg"
      justify="space-between"
      align="center"
      onClick={onClick}
    >
      <Group spacing="xs">
        {Icon && <Icon fontSize="1.2rem" />}
        <Text weight="bold">{title}</Text>
      </Group>
      <Group spacing={5}>
        {text && (
          <Text size="sm" color="dimmed">
            {text}
          </Text>
        )}
        {rightSection}
      </Group>
    </Flex>
  );
}
