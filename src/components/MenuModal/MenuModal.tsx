import { Text, Group, Modal, type ModalProps, Stack, useMantineTheme, type ColorScheme } from '@mantine/core';
import { IconMenu2, type TablerIconsProps } from '@tabler/icons-react';

export interface MenuModalProps extends ModalProps {
  icon?: React.ComponentType<TablerIconsProps>;
}

export const getMenuColors = (scheme: ColorScheme): [string, string] =>
  scheme === 'dark' ? [`#222`, `#2f2f2f`] : [`#e9e9e9`, `#fff`];

export const useMenuModalColor = () => {
  const theme = useMantineTheme();
  return theme.colorScheme === 'dark' ? [`#222`, `#2f2f2f`] : [`#fff`, `#f6f6f6`];
};

export function MenuModal({ title, children, icon: Icon = IconMenu2, ...props }: MenuModalProps) {
  const theme = useMantineTheme();
  const [primaryColor, secondaryColor] = getMenuColors(theme.colorScheme);

  return (
    <Modal.Root radius={6} size="sm" centered {...props}>
      <Modal.Overlay zIndex={201} opacity={0.5} />
      <Modal.Content bg={primaryColor}>
        <Modal.Header bg={secondaryColor}>
          <Modal.Title>
            <Group spacing="xs">
              <Icon size="1.5rem" />
              <Text size="lg" weight="bold">
                {title}
              </Text>
            </Group>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p="0">
          <Stack py="sm" spacing="md">
            {children}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
