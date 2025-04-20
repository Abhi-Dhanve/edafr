import * as t from "drizzle-orm/pg-core";
import { users } from "./user";
import { timestamps } from "./helpers";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type DayOfWeek = (typeof DAYS)[number];

export const sessions = t.pgTable("sessions", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 50 }).notNull(),
  totalPrice: t.integer("total_price").notNull(),
  numberOfSessions: t.integer("number_of_sessions").notNull(),
  days: t.jsonb("days").$type<DayOfWeek[]>().notNull(),
  ...timestamps,
});

export const userSessions = t.pgTable(
  "user_sessions",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: t
      .integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: t
      .integer()
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    paymentId: t.varchar({ length: 42 }).notNull(),
    ...timestamps,
  },
  (table) => [t.index("user_id_idx").on(table.userId)]
);
