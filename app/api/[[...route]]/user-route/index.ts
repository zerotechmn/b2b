import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { driver, user } from "../../database/schema";
import { JWTPayloadExtended } from "../auth-route/auth-user";
import inviteManager from "./invite-manager";

const userRoute = new Hono()
  .get("/me", (c) => {
    const payload = c.get("jwtPayload") as JWTPayloadExtended;
    console.log("payload", payload);
    return c.json({ user: payload }, 200);
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

      const dbDriver = await db.query.driver.findFirst({
        where: eq(user.phone, phoneNumber),
      });

      if (dbDriver) {
        return c.json({ error: "Driver already exists" }, 400);
      }

      const newDriver = await db
        .insert(driver)
        .values({
          phone: phoneNumber,
          vendorId,
        })
        .returning();

      // TODO: Send SMS to the phone

      return c.json({ driver: newDriver[0] }, 200);
    }
  )
  .post(
    "/create-driver",
    zValidator(
      "json",
      z.object({
        phoneNumber: z.string(),
        vendorId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        registerNumber: z.string(),
        carNumber: z.string(),
      })
    ),
    async (c) => {
      const {
        phoneNumber,
        vendorId,
        firstName,
        lastName,
        registerNumber,
        carNumber,
      } = c.req.valid("json");
      const dbDriver = await db.query.driver.findFirst({
        where: and(
          eq(user.phone, phoneNumber),
          eq(driver.registerNumber, registerNumber)
        ),
      });

      if (dbDriver) {
        return c.json(
          {
            error:
              "Driver already exists with similar phone number or register number.",
          },
          400
        );
      }

      const newDriver = await db.insert(driver).values({
        phone: phoneNumber,
        vendorId,
        firstName,
        lastName,
        registerNumber,
        carNumber,
      });

      return c.json({ driver: newDriver[0] }, 200);
    }
  )
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default userRoute;
