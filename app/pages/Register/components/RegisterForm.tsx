import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import ControlledDrawer from "../../../shared/components/ControlledDrawer";
import ConfirmationDrawer from "./ConfirmationDrawer";
import api from "../../../shared/hooks/api";
import {
  calculateSessionDates,
  cn,
  formatDayName,
  sortDaysOfWeek,
} from "../../../shared/utils/utils";
import Icon from "../../../shared/components/Icon";
import { toast } from "sonner";

export default function () {
  const { data: user } = api.useSelfInfo();
  const { data: sessions } = api.useSessionsList();
  const [showConfirmationDrawer, setShowConfirmationDrawer] = useState(false);
  const [sessionDates, setSessionDates] = useState<Date[]>([]);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedSession = Number(searchParams.get("session") || 0);

  const selectedSessionDetails = sessions?.find(
    (session) => session.id === selectedSession
  );

  const updateSelectedSession = (sessionId: number) => {
    if (sessionId) {
      searchParams.set("session", sessionId.toString());
    } else {
      searchParams.delete("session");
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (selectedSessionDetails) {
      const { sessionDates, endDate } = calculateSessionDates(
        selectedSessionDetails.numberOfSessions,
        selectedSessionDetails.days
      );
      setSessionDates(sessionDates);
      setEndDate(endDate);
    } else {
      setSessionDates([]);
      setEndDate(null);
    }
  }, [selectedSessionDetails]);

  if (!sessions) {
    return (
      <div className="flex items-center justify-center p-4 h-40">
        <p>Loading sessions...</p>
      </div>
    );
  }

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

            return (
              <div
                key={dateStr}
                className={cn(
                  "h-7 flex items-center justify-center text-xs rounded-full",
                  isSessionDay
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground/70"
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

  return (
    <div role="form" className="p-4 pt-2 border rounded-xl bg-card w-full">
      <div>
        <label className="text-sm">Name</label>
        <input
          type="text"
          disabled
          defaultValue={user?.name || ""}
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

      <div className="mt-3">
        <label className="text-sm">Choose a Program</label>
        <select
          value={selectedSession || ""}
          onChange={(e) => updateSelectedSession(Number(e.target.value))}
          className="w-full p-2 bg-background border rounded-md text-sm"
        >
          <option className="hidden" value="">
            Choose a program
          </option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name} (₹ {session.totalPrice})
            </option>
          ))}
        </select>
      </div>

      {selectedSessionDetails && (
        <div className="mt-4 p-4 border rounded-lg bg-background">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{selectedSessionDetails.name}</h3>
            <p className="font-medium">₹ {selectedSessionDetails.totalPrice}</p>
          </div>

          <div className="text-sm mb-3">
            <p className="text-foreground/80 mb-1">
              Number of sessions: {selectedSessionDetails.numberOfSessions}
            </p>

            {selectedSessionDetails.days &&
              selectedSessionDetails.days.length > 0 && (
                <div className="mb-1">
                  <p className="text-foreground/80">Sessions held on:</p>
                  <p className="font-medium">
                    {sortDaysOfWeek(selectedSessionDetails.days)
                      .map(formatDayName)
                      .join(", ")}
                  </p>
                </div>
              )}

            {endDate && (
              <p className="text-foreground/80 mt-2">
                Subscription valid until: {endDate.toLocaleDateString()}
              </p>
            )}
          </div>

          {sessionDates.length > 0 && (
            <div className="border-t pt-3">
              <h3 className="text-sm font-medium mb-2">Session Calendar</h3>

              {Object.entries(getSessionDatesByMonth()).map(([month, dates]) =>
                renderMonthCalendar(month, dates)
              )}

              <div className="mt-2 text-xs flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Session days</span>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className="mt-5 w-full p-2 bg-primary text-primary-foreground rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
        onClick={() => setShowConfirmationDrawer(true)}
        disabled={!selectedSession}
      >
        Next
      </button>

      <ControlledDrawer
        openState={[showConfirmationDrawer, setShowConfirmationDrawer]}
      >
        <ConfirmationDrawer selectedSession={selectedSession} />
      </ControlledDrawer>

      {!!selectedSession && !!selectedSessionDetails && (
        <button className="mt-4 text-xs text-center">
          <p
            className="text-foreground/70 mb-1 underline flex items-center gap-x-1"
            onClick={() => {
              const link = `${window.location.origin}/register?session=${selectedSession}`;
              navigator.clipboard.writeText(link).then(() => {
                toast.success("Link copied to clipboard");
              });
              navigator.share({ url: link });
            }}
          >
            Share this session with others{" "}
            <Icon name="share-2" className="scale-110" />
          </p>
        </button>
      )}
    </div>
  );
}
