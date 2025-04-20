import { useState } from "react";
import api from "../../../shared/hooks/api";
import SessionCard from "./SessionCard";
import { DayOfWeek } from "../../../shared/utils/utils";

interface Session {
  id: number;
  name: string;
  totalPrice: number;
  numberOfSessions: number;
  days: DayOfWeek[];
  createdAt: string;
}

export default function SessionList() {
  const { data: sessions = [], isLoading, isError } = api.useSessionsList();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="md:col-span-1 lg:col-span-1">
      <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-background border border-border/30 rounded-md text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading sessions...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">
          Error loading sessions
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {filteredSessions.length === 0 ? (
            <p className="text-foreground/60 text-sm text-center py-8">
              {searchTerm ? "No matching sessions found" : "No active sessions"}
            </p>
          ) : (
            filteredSessions.map((session: Session) => (
              <SessionCard key={session.id} session={session} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
