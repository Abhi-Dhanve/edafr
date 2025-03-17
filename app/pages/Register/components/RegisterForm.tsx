import { useState } from "react";
import Icon from "../../../shared/components/Icon";
import ControlledDrawer from "../../../shared/components/ControlledDrawer";
import ConfirmationDrawer from "./ConfirmationDrawer";
import api from "../../../shared/hooks/api";

export default function () {
  const {data : user} = api.useSelfInfo()
  const {data : sessions} = api.useSessionsList();

  const [showConfirmationDrawer, setShowConfirmationDrawer] = useState(false);

  const [selectedSessions, setSelectedSessions] = useState([
    { id: 0, quantity: 1 },
  ]);

  function addSession() {
    setSelectedSessions((p) => [...p, { id: 0, quantity: 1 }]);
  }

  function updateSession(
    idx: number,
    key: keyof (typeof selectedSessions)[number],
    value: string | number
  ) {
    setSelectedSessions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s))
    );
  }

  if (!sessions) return <div>Loading...</div>;

  return (
    <div role="form" className="p-4 pt-2 border rounded-xl bg-card w-full">
      <div>
        <label className="text-sm">Name</label>
        <input
          type="text"
          disabled
          defaultValue={user?.name}
          className="w-full p-2 mt-1 bg-background border rounded-lg text-sm disabled:text-foreground/50"
        />
      </div>

      <div className="mt-3">
        <label className="text-sm">Email</label>
        <input
          type="text"
          disabled
          defaultValue={user?.email}
          className="w-full p-2 mt-1 bg-background border rounded-lg text-sm disabled:text-foreground/50"
        />
      </div>

      {selectedSessions.map((s, idx) => (
        <div key={s.id} className="mt-3 flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-sm">Choose a session</label>

            <div className="flex gap-x-2 items-center mt-1">
              <select
                value={s.id}
                onChange={(e) => updateSession(idx, "id", e.target.value)}
                className="flex-1 p-2 bg-background border rounded-md text-sm"
              >
                <option className="hidden" value="">
                  Choose a session
                </option>
                {sessions.map((session, key) => (
                  <option key={key} value={key}>
                    {session.name}
                    {` (₹ ${session.unitPrice} / ${session.billedPer})`}
                  </option>
                ))}
              </select>

              <span>for</span>

              <input
                type="number"
                min="1"
                value={s.quantity}
                onChange={(e) => updateSession(idx, "quantity", e.target.value)}
                className="text-sm px-2 w-8 border-b border-b-foreground/40 text-center"
              />

              <span>{sessions[s.id].billedPer}s</span>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSession}
        className="mt-3 w-full p-2 bg-background text-primary border border-primary rounded-lg cursor-pointer flex items-center justify-center gap-x-1"
      >
        <Icon name="plus" className="size-6" /> Add More
      </button>

      <button
        className="mt-5 w-full p-2 bg-primary text-primary-foreground rounded-lg cursor-pointer"
        onClick={() => setShowConfirmationDrawer(true)}
      >
        Next
      </button>

      <ControlledDrawer
        openState={[showConfirmationDrawer, setShowConfirmationDrawer]}
      >
        <ConfirmationDrawer selectedSessions={selectedSessions} />
      </ControlledDrawer>
    </div>
  );
}
