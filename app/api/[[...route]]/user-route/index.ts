import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { hashPassword } from "../../tools/crypt";
import inviteManager from "./invite-manager";

const userRoute = new Hono()
  .get("/", (c) =>
    c.json({
      user: {
        name: "fritz",
        password: "",
      },
    })
  )
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
      const newManager = await inviteManager(email, vendorId);
      return c.json({ manager: newManager }, 200);
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
