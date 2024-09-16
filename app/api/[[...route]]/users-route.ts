import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../database/client";
import { permissionEnum, platformEnum, user } from "../database/schema";
import { hashPassword } from "../tools/crypt";
import { platform } from "os";

const usersRoute = new Hono()
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
      })
    ),
    async (c) => {
      const { email } = c.req.valid("json");

      const newUsers = await db
        .insert(user)
        .values({
          email,
          name: "New User",
          vendorId: "",
          firstTimePassword: "",
          refreshToken: "",
          role: platformEnum.ADMIN,
        })
        .returning();

      return c.json({ user: newUsers[0] }, 200);
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

export default usersRoute;
