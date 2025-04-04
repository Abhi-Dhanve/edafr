import { Hono } from "hono";
import ensureUser from "../middlewares/ensureUser";
import { getPrivyUserFromContext } from "../lib/privy";
import db from "../lib/db";
import { users } from "../lib/db/schema/user";
import { eq, isNull } from "drizzle-orm";
import ensureAdmin from "../middlewares/ensureAdmin";

const app = new Hono();

app.get("/self", ensureUser, async (ctx) => {
    const { user } = ctx.var;

    return ctx.json({ user }, 200);
});

app.get("/all", async (ctx) => {
    try {
        const allUsers = await db.select().from(users);

        if(allUsers.length == 0){return ctx.text("No users", 404)}
        return ctx.json({ users: allUsers }, 200);
    } catch (error) {
        console.log(error);
        return ctx.json(error , 400);
    }  
  
})

app.post("/self", async (ctx) => {
    const { name } = await ctx.req.json();

    if (typeof name != "string") return ctx.text("Name is required", 400);

    const privyUser = await getPrivyUserFromContext(ctx);

    if (!privyUser) return ctx.text("Unauthorized", 401);

    const { 0: existingUser } = await db.select().from(users).where(
        eq(users.privyId, privyUser.id),
    ).limit(1);
    if (existingUser) return ctx.text("User already exists", 409);

    await db.insert(users).values({
        privyId: privyUser.id,
        name,
        email: privyUser.google?.email || privyUser.email?.address ||
            "invalid@email.com",
    });

    return ctx.text("Success", 201);
});

app.put("/self", ensureUser, async (ctx) => {

    try {
        const { name } = await ctx.req.json();
        const { user } = ctx.var;
        console.log(user);
        if (typeof name != "string") return ctx.text("Name is required", 400);
        await db.update(users).set({ name }).where(eq(users.id, user.id));
        ctx.text("Success", 200);
        return ctx.json({name},200);

    } catch (error) {
       console.log(error);
       return ctx.json({error: "error"},400); 
    }
   
});


app.delete("/:id", ensureAdmin, async (ctx) => {
    try {
        const userId = ctx.req.param("id");
        
        // Check if the user exists first
        const { 0: userToDelete } = await db.select()
            .from(users)
            .where(eq(users.id, Number(userId)))
            .limit(1);
            
        if (!userToDelete) {
            return ctx.json({ error: "User not found" }, 404);
        }

        // Delete the user
        await db.delete(users).where(eq(users.id, Number(userId)));
        
        return ctx.json({ 
            message: "User deleted successfully",
            deletedUserId: userId 
        }, 200);
    } catch (error) {
        console.log(error);
        return ctx.json({ error: "Failed to delete user" }, 400);
    }
});



export default app;
