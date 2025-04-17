import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList.tsx';
import UserList from './components/UserList';
import Header from './components/Header';
import api from '../../shared/hooks/api.ts';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';




export default function (){
  
  const adminEmail: string[] = ["abhidhanve483@gmail.com", "spandan567@gmail.com", "admin3"];
  const {data :user} = api.useSelfInfo();
  console.log(user)
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !adminEmail.includes(user.email)) {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isAdmin = adminEmail.includes(user.email);
  if (!isAdmin) {
    return <div>going to other screen</div>;
  }



  return (
    <div className="max-h-screen bg-[rgb(20,12,12)] p-4 md:p-6 lg:p-8">
      <Header title="Admin Dashboard" />
      <div className="max-w-7xl mt-16 lg:mt-12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SessionForm />
        <SessionList />
        <UserList  />
      </div>
    </div>
  );
};

