import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";
import { generateAccessToken } from "../../../../lib/jwt";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { comparePassword } from "../../tools/crypt";

const vendorRoute = new Hono().post(
  "/create",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      register: z.string(),
      phoneNumber: z.string(),
      email: z.string(),
      address: z.object({
        bagKhorooId: z.string(),
        details: z.string(),
        coordinate: z.string(),
        phone_number: z.string(),
      }),
    })
  ),
  async (c) => {}
);

export default vendorRoute;
