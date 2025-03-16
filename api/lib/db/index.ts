import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import schema from "./schema";
import env from "../../../env";

const client = new SQL(env.DB_URI);
const db = drizzle({
    client,
    schema,
    casing: "snake_case",
});

export default db;
