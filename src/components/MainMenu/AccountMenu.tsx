import { default as router } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { MenuModal, MenuModalSection, type MenuModalProps, MenuModalRow } from '../MenuModal';

const gotoUsagePage = () => {
  router.push('/user/usage/').catch(() => void 0);
};

export function AccountMenu(props: MenuModalProps) {
  const user = useUser();

  return (
    <MenuModal {...props} title="Account">
      <MenuModalSection>
        <MenuModalRow title="Name" rightSection={user?.name} />
        <MenuModalRow title="Usage" onClick={gotoUsagePage} />
      </MenuModalSection>
      <MenuModalSection>
        <MenuModalRow title="Edit Profile" onClick={console.log} />
        <MenuModalRow title="Reset Password" onClick={console.log} />
      </MenuModalSection>
    </MenuModal>
  );
}
