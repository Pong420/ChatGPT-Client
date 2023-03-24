import { MenuModal, MenuModalSection, type MenuModalProps, MenuModalRow } from '../MenuModal';

export function AccountMenu(props: MenuModalProps) {
  return (
    <MenuModal {...props} title="Account">
      <MenuModalSection>
        <MenuModalRow title="Name" />
        <MenuModalRow title="Usage" text="1,000" onClick={console.log} />
        <MenuModalRow title="Register At" />
      </MenuModalSection>
      <MenuModalSection>
        <MenuModalRow title="Edit Profile" onClick={console.log} />
        <MenuModalRow title="Reset Password" onClick={console.log} />
      </MenuModalSection>
    </MenuModal>
  );
}
