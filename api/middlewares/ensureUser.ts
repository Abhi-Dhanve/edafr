import { createMiddleware } from "hono/factory";
import { getPrivyUserFromContext } from "../lib/privy";
import db from "../lib/db";
import { eq } from "drizzle-orm";
import { users } from "../lib/db/schema/user";
import { DB } from "../lib/db/schema";
import { Address } from "viem";

const ensureUser = createMiddleware<{
    Variables: {
        user: DB["user"] & { address: Address };
    };
}>(async (ctx, next) => {
    const privyUser = await getPrivyUserFromContext(ctx);
    if (!privyUser) return ctx.text("Unauthorized", 401);

    
    const privyId = privyUser.id;
    
    let { 0: user } = await db.select().from(users).where(
        eq(users.privyId, privyId),
    )
    .limit(1);
    
    if (!user) return ctx.json("Missing user in DB", 424);
    
    ctx.set("user", user as DB["user"] & { address: Address });
    await next();
});

export default ensureUser;
