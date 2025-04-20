import { createMiddleware } from "hono/factory";
import { every } from "hono/combine";
import ensureUser from "./ensureUser";
import { respond } from "../utils/respond";

const admins: string[] = ["abhidhanve483@gmail.com", "spandan567@gmail.com"];

const adminOnly = every(
  ensureUser,
  createMiddleware(async (ctx, next) => {
    if (!admins.includes(ctx.var.user.email)) {
      return respond.err(ctx, "Forbidden", 403);
    }
    await next();
  })
);

export default adminOnly;
