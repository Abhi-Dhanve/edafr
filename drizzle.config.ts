import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
    out: "./drizzle",
    schema: "./api/lib/db/schema",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DB_URI,
    },
    casing: "snake_case",
});
