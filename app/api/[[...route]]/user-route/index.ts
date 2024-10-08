import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { hashPassword } from "../../tools/crypt";
import inviteManager from "./invite-manager";
import { decode } from "hono/jwt";

const userRoute = new Hono()
  .get("/me", (c) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json({ error: "Authorization header is missing" }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ error: "Token is missing" }, 401);
    }

    try {
      const { payload } = decode(token);

      return c.json({ user: payload }, 200);
    } catch (error) {
      return c.json({ error: "Invalid token" }, 401);
    }
  })
  .post(
    "/invite",
    zValidator(
      "json",
      z.object({
        email: z.string(),
        vendorId: z.string(),
      })
    ),
    async (c) => {
      const { email, vendorId } = c.req.valid("json");
      return await inviteManager(c, email, vendorId);
    }
  )
  .post(
    "/confirm-invitation",
    zValidator(
      "json",
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");

      const newUsers = await db
        .update(user)
        .set({ password: await hashPassword(password) })
        .where(eq(user.email, email))
        .returning();

      return c.json({ user: newUsers[0] }, 200);
    }
  )
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default userRoute;
