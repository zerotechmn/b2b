import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { decode } from "hono/jwt";
import { z } from "zod";
import { DRIVER_ROLENAME } from "../../constants";
import { db } from "../../database/client";
import { convertPgEnum, platformEnum, role, user } from "../../database/schema";
import { hashPassword } from "../../tools/crypt";
import inviteManager from "./invite-manager";

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
    "/invite-driver",
    zValidator(
      "json",
      z.object({
        phoneNumber: z.string(),
        vendorId: z.string(),
      })
    ),
    async (c) => {
      const { phoneNumber, vendorId } = c.req.valid("json");

      const dbUser = await db.query.user.findFirst({
        where: and(eq(user.phone, phoneNumber)),
      });

      if (dbUser) {
        return c.json({ error: "User already exists" }, 400);
      }

      let driverRole = await db.query.role
        .findFirst({
          where: eq(role.name, DRIVER_ROLENAME),
        })
        .then((res) => res);

      // TODO: Delete later because this role should always exist
      if (!driverRole) {
        const newRole = await db
          .insert(role)
          .values({
            name: DRIVER_ROLENAME,
            platform: convertPgEnum(platformEnum).DRIVER,
            permissions: [],
          })
          .returning();
        driverRole = newRole[0];
      }

      // TODO: create driver not user
      const newUsers = await db
        .insert(user)
        .values({
          phone: phoneNumber,
          name: "New User",
          vendorId,
          roleId: driverRole.id,
        })
        .returning();

      // Send SMS

      return c.json({ user: newUsers[0] }, 200);
    }
  )
  .post(
    "/create-driver",
    zValidator(
      "json",
      z.object({
        phoneNumber: z.string(),
        vendorId: z.string(),
      })
    ),
    async (c) => {
      const { phoneNumber, vendorId } = c.req.valid("json");
      // return await inviteManager(c, email, vendorId);
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
