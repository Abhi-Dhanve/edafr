import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at", { mode: "date" }),
};
