import { useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../shared/hooks/api";
import Header from "./components/Header";
import SessionForm from "./components/SessionForm";
import SessionList from "./components/SessionList";
import UserList from "./components/UserList";
import { toast } from "sonner";

const ADMIN_EMAILS = [
  "abhidhanve483@gmail.com",
  "spandan567@gmail.com",
  "admin3",
];

export default function AdminPage() {
  const { data: user, isLoading } = api.useSelfInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !ADMIN_EMAILS.includes(user.email)) {
      toast.error("You don't have permission to access the admin dashboard");
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex-center flex-col">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <Header title="Admin Dashboard" />
      <div className="max-w-7xl mt-16 lg:mt-12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SessionForm />
        <SessionList />
        <UserList />
      </div>
    </div>
  );
}
