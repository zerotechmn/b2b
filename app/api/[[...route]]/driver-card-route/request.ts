import { zValidator } from "@hono/zod-validator";
import { eq, SQL } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  cardRequest,
  cardRequestStatusEnum,
  convertPgEnum,
  vendor,
} from "../../database/schema";
import { JWTPayloadExtended } from "../auth-route/auth-user";

const cardRequestRoute = new Hono()
  .get("/:id", async (c) => {
    const cardRequestId = c.req.param("id");
    const dbCardRequest = await db.query.cardRequest.findFirst({
      where: eq(cardRequest.id, cardRequestId),
    });
    if (!dbCardRequest) return c.json({ error: "Card request not found" }, 404);

    return c.json({ cardRequest: dbCardRequest }, 200);
  })
  .get("/list", async (c) => {
    const { vendorId } = c.get("jwtPayload") as JWTPayloadExtended;
    let where: SQL<unknown> | undefined;
    if (vendorId) where = eq(cardRequest.vendorId, vendorId);

    const cardRequests = await db.query.cardRequest.findMany({
      where,
      with: {
        vendor: true,
      },
    });

    return c.json({ cardRequests }, 200);
  })
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        vendorId: z.string(),
        requestedCardCount: z.number(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { vendorId, requestedCardCount } = c.req.valid("json");

      const dbVendor = await db.query.vendor.findFirst({
        where: eq(vendor.id, vendorId),
      });
      if (!dbVendor) return c.json({ error: "Vendor not found" }, 404);

      const newCardsRequest = await db
        .insert(cardRequest)
        .values({
          vendorId,
          requestedUserId: id,
          requestedCardCount,
          status: convertPgEnum(cardRequestStatusEnum).PENDING,
          fulfilledCardIds: [],
        })
        .returning();

      return c.json({ cardRequest: newCardsRequest[0] }, 200);
    }
  );

export default cardRequestRoute;
