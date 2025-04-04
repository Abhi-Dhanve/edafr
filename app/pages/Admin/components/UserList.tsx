// components/UserList.tsx
import UserCard from './UserCard.tsx';
import api from '../../../shared/hooks/api.ts';


interface User {

  id: number;
  createdAt: string;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
}


export default function () {

  const {data: users = []} = api.useAllUsers();
  console.log(users);

  return (
    <section className="md:col-span-1 lg:col-span-1">
      <h2 className="text-lg font-semibold text-white mb-4 ">Users</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
};

