import { Navbar } from './Navrbar';

export const getLayout = (page: React.ReactElement): React.ReactNode => <Layout>{page}</Layout>;

export type GetLayout = typeof getLayout;

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
