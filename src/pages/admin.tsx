// import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { UserTable } from '@/components/admin/UserTable';
import { api } from '@/utils/api';

export default function AdminPage() {
  const users = api.admin.getUsers.useQuery();

  return (
    <div>
      <UserTable data={users.data?.map(u => ({ name: u.email, email: u.email, company: 'World' })) || []} />
    </div>
  );
}
