import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGithub, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { MenuModal, type MenuModalProps, MenuModalRow, MenuModalSection } from '@/components/MenuModal';
import { AccountMenu } from './AccountMenu';
import { Preferences } from './Preferences';
import pkg from '../../../package.json';

export function MainMenu(props: MenuModalProps) {
  const [accMenu, accMenuCtrl] = useDisclosure();
  const [prefMenu, prefMenuCtrl] = useDisclosure();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut({ redirect: true });
    } catch (error) {}
    setLoading(false);
  }

  return (
    <>
      <MenuModal title="Menu" {...props}>
        <MenuModalSection>
          <MenuModalRow title="Account" icon={IconUserCircle} onClick={accMenuCtrl.open} />
          <MenuModalRow title="Preferences" icon={IconSettings} onClick={prefMenuCtrl.open} />
          <MenuModalRow
            title="Github"
            icon={IconBrandGithub}
            onClick={() => window.open(`https://github.com/Pong420/chat-gpt-client`)}
          />
        </MenuModalSection>
        <MenuModalSection>
          <MenuModalRow title="Version" text={pkg.version} />
        </MenuModalSection>

        <Button color="red" mx="md" mt="sm" mb="xs" loading={loading} onClick={() => void handleSignOut()}>
          Sign out
        </Button>
      </MenuModal>
      <AccountMenu opened={accMenu} icon={IconUserCircle} onClose={accMenuCtrl.close} />
      <Preferences opened={prefMenu} icon={IconSettings} onClose={prefMenuCtrl.close} />
    </>
  );
}
