import { Container, Paper } from '@mantine/core';
import { UserTable } from '@/components/UserTable';
import { api } from '@/utils/api';

export function getStaticProps() {
  return {
    props: {},
    // returns the default 404 page with a status code of 404 in production
    notFound: process.env.NODE_ENV === 'production'
  };
}

export default function AdminPage() {
  const users = api.admin.getUsers.useQuery();
  const usersData = users.data || [];

  return (
    <Container p="xl">
      <Paper withBorder shadow="md" w="100%" p="lg">
        <UserTable data={usersData} />
      </Paper>
    </Container>
  );
}
