import { type GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { getLayout } from '@/components/Layout/Layout';
import { authOptions } from '@/server/auth';
import type { NextPageWithLayout } from './_app';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, authOptions)
    }
  };
};

const Home: NextPageWithLayout = () => {
  return null;
};

Home.getLayout = getLayout;

export default Home;
