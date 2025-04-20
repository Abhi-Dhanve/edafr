import { createMiddleware } from "hono/factory";
import { getPrivyUserFromContext } from "../lib/privy";
import db from "../lib/db";
import { eq } from "drizzle-orm";
import { users } from "../lib/db/schema/user";
import { DB } from "../lib/db/schema";
import { respond } from "../utils/respond";
import { tryCatch } from "../../utils/tryCatch";

const ensureUser = createMiddleware<{
  Variables: {
    user: DB["user"];
  };
}>(async (ctx, next) => {
  const privyUser = await getPrivyUserFromContext(ctx);
  if (!privyUser) return respond.err(ctx, "Unauthorized", 401);

  const privyId = privyUser.id;

  ctx.log(privyId);
  let userDbResponse = await tryCatch(
    db.select().from(users).where(eq(users.privyId, privyId)).limit(1)
  );
  ctx.log("LOL");

  if (userDbResponse.error) {
    ctx.log(userDbResponse.error);
    return respond.err(ctx, "Failed to fetch user from DB", 500);
  }

  const [user] = userDbResponse.data;

  if (!user) return respond.err(ctx, "Missing user in DB", 424);

  ctx.set("user", user as DB["user"]);

  await next();
});

export default ensureUser;
