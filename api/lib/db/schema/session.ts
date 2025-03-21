import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";

export const sessions = t.pgTable("sessions", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar({ length: 50 }).notNull(),
    unitPrice: t.integer().notNull(),
    billedPer: t.varchar({ length: 20 }).notNull(),
    ...timestamps,
});
