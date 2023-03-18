import { type NextPage, type GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { Navbar } from '@/components/Navrbar';
import { authOptions } from '@/server/auth';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, authOptions)
    }
  };
};

const Home: NextPage = () => {
  return <Navbar />;
};

export default Home;
