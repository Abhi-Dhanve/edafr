import { useState } from "react";
import { toast } from "sonner";
import Icon from "../../../shared/components/Icon";
import {
  cn,
  DayOfWeek,
  formatDayName,
  sortDaysOfWeek,
} from "../../../shared/utils/utils";
import api from "../../../shared/hooks/api";

interface SessionProps {
  session: {
    id: number;
    name: string;
    totalPrice: number;
    numberOfSessions: number;
    days: DayOfWeek[];
    createdAt: string;
  };
}

export default function SessionCard({ session }: SessionProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const disableSession = api.useDisableSession();

  const handleDelete = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        disableSession.mutate(session.id, {
          onSuccess: () => resolve(true),
          onError: (error) => reject(error),
        });
      }),
      {
        loading: "Deleting session...",
        success: "Session deleted successfully",
        error: "Failed to delete session",
      }
    );
    setShowConfirm(false);
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border/20">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-medium">{session.name}</h3>
          <p className="text-sm text-foreground/80">
            ₹{session.totalPrice} • {session.numberOfSessions} sessions
          </p>
          {session.days && session.days.length > 0 && (
            <p className="text-xs text-foreground/60">
              Held on:{" "}
              {sortDaysOfWeek(session.days).map(formatDayName).join(", ")}
            </p>
          )}
          <p className="text-xs text-foreground/60">
            Created: {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 text-foreground/60 hover:text-red-500 transition-colors"
            >
              <Icon name="trash-2" className="size-5" />
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDelete}
                className={cn(
                  "px-2 py-1 rounded text-xs bg-red-500/90 text-white",
                  disableSession.isPending && "opacity-50 cursor-not-allowed"
                )}
                disabled={disableSession.isPending}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 rounded text-xs bg-foreground/20"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
