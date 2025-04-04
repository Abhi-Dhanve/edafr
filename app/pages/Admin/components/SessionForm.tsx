// components/SessionForm.tsx
import React, { useState } from "react";
import api from "../../../shared/hooks/api";

interface Session {
  id: number;
  name: string;
  unitPrice: number;
  billedPer: string;
}

interface SessionFormProps {
  onAddSession: (session: Session) => void;
}

const SessionForm: React.FC = () => {
  const [newSession, setNewSession] = useState({
    name: "",
    unitPrice: null,
    billedPer: "",
  });

  const createSession = api.useCreateSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = newSession.name;
    const unitPrice = newSession.unitPrice;
    const billedPer = newSession.billedPer;

    createSession.mutate(
      { name, unitPrice, billedPer },
      {
        onSuccess: (response) => {
          console.log("Session Created:", response);
        },
        onError: (error) => {
          console.error("Session Creation Failed:", error);
        },
      }
    );

    setNewSession({ name: "", unitPrice: 0, billedPer: "" });
  };

  return (
    <section className="bg-[rgb(40,25,30)] p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Session Name"
            value={newSession.name}
            onChange={(e) =>
              setNewSession({ ...newSession, name: e.target.value })
            }
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Price per Hour"
            value={newSession.unitPrice}
            onChange={(e) =>
              setNewSession({
                ...newSession,
                unitPrice: Number(e.target.value),
              })
            }
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Duration"
            value={newSession.billedPer}
            onChange={(e) =>
              setNewSession({ ...newSession, billedPer: e.target.value })
            }
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-opacity-90"
        >
          Add Session
        </button>
      </form>
    </section>
  );
};

export default SessionForm;
