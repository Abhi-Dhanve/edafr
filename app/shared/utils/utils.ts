import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const dayOrder: Record<DayOfWeek, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

export function sortDaysOfWeek(days: DayOfWeek[]): DayOfWeek[] {
  return [...days].sort((a, b) => dayOrder[a] - dayOrder[b]);
}

export function calculateSessionDates(
  numberOfSessions: number,
  sessionDays: DayOfWeek[],
  startDate: Date = new Date()
): {
  sessionDates: Date[];
  endDate: Date | null;
} {
  if (!numberOfSessions || !sessionDays || sessionDays.length === 0) {
    return { sessionDates: [], endDate: null };
  }

  const dayToJsDay: Record<DayOfWeek, number> = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    sun: 0,
  };

  let currentDate = new Date(startDate);

  currentDate.setHours(0, 0, 0, 0);

  let remainingSessions = numberOfSessions;
  const sessionDates: Date[] = [];

  while (remainingSessions > 0) {
    const dayOfWeek = currentDate.getDay();

    if (sessionDays.some((day) => dayToJsDay[day] === dayOfWeek)) {
      sessionDates.push(new Date(currentDate.getTime()));
      remainingSessions--;
    }

    if (remainingSessions > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return {
    sessionDates,
    endDate:
      sessionDates.length > 0 ? sessionDates[sessionDates.length - 1] : null,
  };
}

export function formatDayName(day: string): string {
  const dayMap: Record<string, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };
  return dayMap[day] || day;
}
