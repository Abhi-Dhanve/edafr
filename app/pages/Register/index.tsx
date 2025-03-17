import { useState } from "react";
import Icon from "../../shared/components/Icon";
import { usePrivy } from "@privy-io/react-auth";

const sessions = [
  { id: 1, name: "Session A", price: "$50" },
  { id: 2, name: "Session B", price: "$75" },
  { id: 3, name: "Session C", price: "$100" },
];

export default function () {
  const privy = usePrivy(); 

  const [selectedSessions, setSelectedSessions] = useState([
    { id: Date.now(), sessionId: "" },
  ]);

  const addSession = () => {
    setSelectedSessions([
      ...selectedSessions,
      { id: Date.now(), sessionId: "" },
    ]);
  };

  const updateSession = (id, value) => {
    setSelectedSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, sessionId: value } : s))
    );
  };

  return (
    <div className="flex flex-col items-center p-page py-5">
      <h1 className="text-2xl font-semibold text-center mb-5">
        Register for sessions
      </h1>

      <div role="form" className="p-4 border rounded-xl bg-card w-full">
        <div>
          <label className="text-sm">Name</label>
          <input
            type="text"
            disabled
            defaultValue={privy.user?.google?.name}
            className="w-full p-2 mt-1 bg-background border rounded-lg text-sm disabled:text-foreground/50"
          />
        </div>

        <div className="mt-3">
          <label className="text-sm">Email</label>
          <input
            type="text"
            disabled
            defaultValue={privy.user?.google?.email}
            className="w-full p-2 mt-1 bg-background border rounded-lg text-sm disabled:text-foreground/50"
          />
        </div>

        {selectedSessions.map((s) => (
          <div key={s.id} className="mt-3">
            <label className="text-sm">Choose a session</label>

            <select
              value={s.sessionId}
              onChange={(e) => updateSession(s.id, e.target.value)}
              className="w-full p-2 mt-1 bg-background border rounded-lg placeholder:text-foreground/70 group"
            >
              <option className="hidden" value="">
                Choose a session
              </option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} - {session.price}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={addSession}
          className="mt-2 w-full p-2 bg-background text-primary border border-primary rounded-lg cursor-pointer flex items-center justify-center gap-x-1"
        >
          <Icon name="plus" className="size-6" strokeWidth={2} /> Add More
        </button>

        <button
          onClick={addSession}
          className="mt-5 w-full p-2 bg-primary text-primary-foreground rounded-lg cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
