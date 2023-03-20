import { AppShell, Footer, useMantineTheme } from '@mantine/core';
import { Navbar } from './Navrbar';

export const getLayout = (page: React.ReactElement): React.ReactNode => <Layout>{page}</Layout>;

export type GetLayout = typeof getLayout;

export function Layout(props: React.PropsWithChildren) {
  const theme = useMantineTheme();
  return (
    <AppShell
      padding={0}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      }}
      navbar={<Navbar />}
    >
      {props.children}
    </AppShell>
  );
}
