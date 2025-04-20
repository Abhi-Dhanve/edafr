import React, { useState } from "react";
import api from "../../../shared/hooks/api";
import { toast } from "sonner";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type DayOfWeek = (typeof DAYS)[number];

interface Session {
  id: number;
  name: string;
  totalPrice: number;
  numberOfSessions: number;
  days: DayOfWeek[];
}

const SessionForm: React.FC = () => {
  const [newSession, setNewSession] = useState({
    name: "",
    totalPrice: 0,
    numberOfSessions: 1,
    days: [] as DayOfWeek[],
  });

  const createSession = api.useCreateSession();

  const weekdays = DAYS;

  const handleDayToggle = (day: DayOfWeek) => {
    setNewSession((prev) => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSession.name) {
      toast.error("Please enter a session name");
      return;
    }

    if (newSession.totalPrice <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    if (newSession.numberOfSessions <= 0) {
      toast.error("Number of sessions must be greater than zero");
      return;
    }

    if (newSession.days.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    createSession.mutate(newSession, {
      onSuccess: () => {
        toast.success("Session created successfully");
        setNewSession({
          name: "",
          totalPrice: 0,
          numberOfSessions: 1,
          days: [],
        });
      },
    });
  };

  return (
    <section className="bg-[rgb(40,25,30)] p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Program</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/80 mb-1">
            Program Name
          </label>
          <input
            type="text"
            placeholder="e.g., Morning Yoga"
            value={newSession.name}
            onChange={(e) =>
              setNewSession({ ...newSession, name: e.target.value })
            }
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">
            Total Price (₹)
          </label>
          <input
            type="number"
            placeholder="Total price for all sessions"
            value={newSession.totalPrice || ""}
            onChange={(e) =>
              setNewSession({
                ...newSession,
                totalPrice: Number(e.target.value),
              })
            }
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">
            Number of Sessions
          </label>
          <input
            type="number"
            placeholder="How many sessions included"
            value={newSession.numberOfSessions || ""}
            onChange={(e) =>
              setNewSession({
                ...newSession,
                numberOfSessions: Number(e.target.value),
              })
            }
            min="1"
            className="w-full p-2 rounded bg-[rgb(20,12,12)] text-white border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">
            Session Days
          </label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-2 py-1 rounded text-sm ${
                  newSession.days.includes(day)
                    ? "bg-primary text-primary-foreground"
                    : "bg-[rgb(20,12,12)] text-white/70 border border-[var(--border)]"
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-opacity-90"
          disabled={createSession.isPending}
        >
          {createSession.isPending ? "Creating..." : "Add Session"}
        </button>
      </form>
    </section>
  );
};

export default SessionForm;
