import { useState } from "react";
import { toast } from "sonner";
import Icon from "../../../shared/components/Icon";
import {
  cn,
  calculateSessionDates,
  formatDayName,
  sortDaysOfWeek,
  DayOfWeek,
} from "../../../shared/utils/utils";
import api from "../../../shared/hooks/api";
import UserAvatar from "../../../shared/components/UserAvatar";
import ControlledDrawer from "../../../shared/components/ControlledDrawer";

interface UserProps {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

interface UserSession {
  id: number;
  sessionId: number;
  userId: number;
  paymentId: string;
  createdAt: string;
  sessionDetails: {
    name: string;
    totalPrice: number;
    numberOfSessions: number;
    days: DayOfWeek[];
  };
}

export default function UserCard({ user }: UserProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(
    null
  );
  const [showCalendarDrawer, setShowCalendarDrawer] = useState(false);

  const { mutate: deleteUser } = api.useDeleteUser();
  const { data: userSessions, isLoading: sessionsLoading } =
    api.useUserSessions(user.id);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        deleteUser(user.id, {
          onSuccess: () => resolve(true),
          onError: (error) => reject(error),
        });
      }),
      {
        loading: "Deleting user...",
        success: `User ${user.name} deleted successfully`,
        error: "Failed to delete user",
      }
    );
    setShowConfirm(false);
  };

  const getSessionEndDate = (session: UserSession) => {
    const { endDate } = calculateSessionDates(
      session.sessionDetails.numberOfSessions,
      session.sessionDetails.days,
      new Date(session.createdAt)
    );
    return endDate;
  };

  const handleSessionClick = (session: UserSession) => {
    setSelectedSession(session);
    setShowCalendarDrawer(true);
  };

  return (
    <div className="bg-card rounded-lg border border-border/20 overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} className="size-10 rounded-full" />
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-foreground/80">{user.email}</p>
            <p className="text-xs text-foreground/60">
              Joined: {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-foreground/60 hover:text-primary transition-colors"
            title={isExpanded ? "Collapse" : "Show sessions"}
          >
            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              className="size-5"
            />
          </button>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 text-foreground/60 hover:text-red-500 transition-colors"
              title="Delete user"
            >
              <Icon name="trash-2" className="size-5" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-2 py-1 rounded text-xs bg-red-500/90 text-white"
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

      {isExpanded && (
        <div className="bg-background/30 border-t border-border/20 p-4">
          <h4 className="text-sm font-medium mb-3">User Sessions</h4>

          {sessionsLoading ? (
            <div className="text-center py-2 text-sm">Loading sessions...</div>
          ) : !userSessions || userSessions.length === 0 ? (
            <p className="text-sm text-foreground/60 text-center py-2">
              No sessions found for this user
            </p>
          ) : (
            <div className="space-y-3">
              {userSessions.map((session: UserSession) => {
                const endDate = getSessionEndDate(session);
                const isActive = endDate && new Date() <= endDate;

                return (
                  <div
                    key={session.id}
                    className={cn(
                      "bg-background/50 border border-border/10 rounded p-2 text-sm cursor-pointer hover:bg-background/80 transition-colors",
                      isActive
                        ? "border-l-4 border-l-green-500"
                        : "border-l-4 border-l-red-500"
                    )}
                    onClick={() => handleSessionClick(session)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {session.sessionDetails.name}
                      </span>
                      <span>₹{session.sessionDetails.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs text-foreground/70 mt-1">
                      <span>Registered: {formatDate(session.createdAt)}</span>
                      <span>
                        {session.sessionDetails.numberOfSessions} sessions
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span
                        className={cn(
                          "py-0.5 px-1.5 rounded-full text-[10px]",
                          isActive
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        )}
                      >
                        {isActive ? "Active" : "Expired"}
                      </span>
                      <span className="text-foreground/60">
                        {endDate
                          ? `Valid until: ${formatDate(endDate)}`
                          : "No end date"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <ControlledDrawer openState={[showCalendarDrawer, setShowCalendarDrawer]}>
        {selectedSession && (
          <SessionCalendarView
            session={selectedSession}
            registeredDate={new Date(selectedSession.createdAt)}
          />
        )}
      </ControlledDrawer>
    </div>
  );
}

function SessionCalendarView({
  session,
  registeredDate,
}: {
  session: UserSession;
  registeredDate: Date;
}) {
  const { sessionDates, endDate } = calculateSessionDates(
    session.sessionDetails.numberOfSessions,
    session.sessionDetails.days,
    registeredDate
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const getSessionDatesByMonth = () => {
    const months: Record<string, Date[]> = {};

    sessionDates.forEach((date) => {
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push(date);
    });

    return months;
  };

  const renderMonthCalendar = (month: string, dates: Date[]) => {
    const daysInMonth = new Date(
      dates[0].getFullYear(),
      dates[0].getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      dates[0].getFullYear(),
      dates[0].getMonth(),
      1
    ).getDay();

    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(
        new Date(dates[0].getFullYear(), dates[0].getMonth(), i)
      );
    }

    const sessionDatesSet = new Set(
      dates.map((date) => date.toISOString().split("T")[0])
    );

    return (
      <div key={month} className="mb-4">
        <h3 className="text-sm font-medium mb-2">{month}</h3>
        <div className="grid grid-cols-7 text-center text-xs mb-1">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-7"></div>;
            }

            const dateStr = day.toISOString().split("T")[0];
            const isSessionDay = sessionDatesSet.has(dateStr);
            const isPast = day < new Date();

            return (
              <div
                key={dateStr}
                className={cn(
                  "h-7 flex items-center justify-center text-xs rounded-full",
                  isSessionDay &&
                    !isPast &&
                    "bg-primary text-primary-foreground font-medium",
                  isSessionDay && isPast && "bg-primary/30 text-foreground/70",
                  !isSessionDay && "text-foreground/40"
                )}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isActive = endDate && new Date() <= endDate;

  return (
    <div className="w-full px-2">
      <h2 className="text-lg font-semibold mb-1">
        {session.sessionDetails.name}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <span
          className={cn(
            "py-1 px-2 rounded-full text-xs",
            isActive
              ? "bg-green-500/20 text-green-500"
              : "bg-red-500/20 text-red-500"
          )}
        >
          {isActive ? "Active" : "Expired"}
        </span>
        <span className="text-sm">₹{session.sessionDetails.totalPrice}</span>
      </div>

      <div className="space-y-2 text-sm mb-4 border-t border-border/20 pt-3">
        <p>
          <span className="text-foreground/60">Registered on:</span>{" "}
          {formatDate(registeredDate)}
        </p>
        <p>
          <span className="text-foreground/60">Total sessions:</span>{" "}
          {session.sessionDetails.numberOfSessions}
        </p>
        {endDate && (
          <p>
            <span className="text-foreground/60">Valid until:</span>{" "}
            {formatDate(endDate)}
          </p>
        )}
        <p>
          <span className="text-foreground/60">Scheduled on:</span>{" "}
          {sortDaysOfWeek(session.sessionDetails.days)
            .map(formatDayName)
            .join(", ")}
        </p>
      </div>

      <div className="border-t border-border/20 pt-4">
        <h3 className="text-sm font-medium mb-3">Session Calendar</h3>

        {Object.entries(getSessionDatesByMonth()).map(([month, dates]) =>
          renderMonthCalendar(month, dates)
        )}

        <div className="mt-3 flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Upcoming sessions</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/30"></div>
            <span>Past sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
