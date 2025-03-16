import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";

export const users = t.pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    privyId: t.varchar({ length: 10 }).notNull(),
    firstName: t.varchar({ length: 32 }).notNull(),
    lastName: t.varchar({ length: 32 }),
    email: t.varchar({ length: 255 }).notNull(),
    ...timestamps,
}, (table) => [
    t.uniqueIndex("privyid_idx").on(table.privyId),
]);
