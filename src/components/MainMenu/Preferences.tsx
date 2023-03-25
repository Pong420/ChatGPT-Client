import { Button, Switch } from '@mantine/core';
import { MenuModal, MenuModalSection, type MenuModalProps, MenuModalRow } from '../MenuModal';

export function Preferences(props: MenuModalProps) {
  return (
    <MenuModal {...props} title="Preferences">
      <MenuModalSection>
        <MenuModalRow title="Dark Mode" rightSection={<Switch size="md" />} />
        <MenuModalRow title="Fixed Width" rightSection={<Switch size="md" checked />} />
      </MenuModalSection>
      <MenuModalSection>
        <MenuModalRow title="Font Size" />
        <MenuModalRow title="Line Height" />
      </MenuModalSection>

      <Button color="red" mx="md" mt="lg" mb="xs">
        Reset Default
      </Button>
    </MenuModal>
  );
}
