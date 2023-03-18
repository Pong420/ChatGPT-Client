// import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { UserTable } from '@/components/admin/UserTable';
import { api } from '@/utils/api';

export default function AdminPage() {
  const users = api.admin.getUsers.useQuery();
  const usersData = users.data || [];

  return (
    <div>
      <UserTable data={usersData.map(u => ({ name: u.email || '', email: u.email, company: 'World' }))} />
    </div>
  );
}
