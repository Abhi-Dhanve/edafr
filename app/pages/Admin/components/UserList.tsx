import { useState } from "react";
import UserCard from "./UserCard";
import api from "../../../shared/hooks/api";

interface User {
  id: number;
  createdAt: string;
  name: string;
  email: string;
}

export default function UserList() {
  const { data: users = [], isLoading, isError } = api.useAllUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="md:col-span-1 lg:col-span-1">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-background border border-border/30 rounded-md text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">Error loading users</div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2">
          {filteredUsers.length === 0 ? (
            <p className="text-foreground/60 text-sm text-center py-8">
              {searchTerm ? "No matching users found" : "No users in system"}
            </p>
          ) : (
            filteredUsers.map((user: User) => (
              <UserCard key={user.id} user={user} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
