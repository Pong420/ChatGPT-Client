import { AppShell } from '@mantine/core';
import { Navbar } from './Navrbar';

export const getLayout = (page: React.ReactElement): React.ReactNode => <Layout>{page}</Layout>;

export type GetLayout = typeof getLayout;

export function Layout(props: React.PropsWithChildren) {
  return (
    <AppShell padding={0} navbar={<Navbar />}>
      {props.children}
    </AppShell>
  );
}
