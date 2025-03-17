import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";

export const users = t.pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    privyId: t.varchar({ length: 42 }).notNull(),
    name: t.varchar({ length: 32 }).notNull(),
    email: t.varchar({ length: 124 }).notNull(),
    ...timestamps,
}, (table) => [
    t.uniqueIndex("privyid_idx").on(table.privyId),
]);
