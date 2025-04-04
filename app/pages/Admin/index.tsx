import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList.tsx';
import UserList from './components/UserList';
import Header from './components/Header';




export default function (){

  
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

