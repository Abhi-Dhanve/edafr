import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { users } from "./user";


export const userSessions = t.pgTable("user_sessions", {
// User Sessions (Junction Table)
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar({ length: 32 }).notNull(),
    email: t.varchar({ length: 124 }).notNull(),
    userId: t.integer().notNull().references(() => users.id, { onDelete: "cascade" }),
    sessionIds: t.jsonb().notNull(), 
    paymentStatus: t.varchar({ length: 20 }).notNull(),  // e.g., "paid", "pending", "cancelled"
    ...timestamps,
});

