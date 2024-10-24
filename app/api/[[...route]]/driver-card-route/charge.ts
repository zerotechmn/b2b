import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  card,
  vendor,
  statement,
  convertPgEnum,
  statementTypeEnum,
} from "../../database/schema";
import { JWTPayloadExtended } from "../auth-route/auth-user";

const chargeRoute = new Hono()
  .post(
    "/charge",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
        vendorId: z.string(),
        amount: z.number().positive(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId, amount, vendorId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: and(eq(card.id, cardId), eq(card.vendorId, vendorId)),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);

      const dbVendor = await db.query.vendor.findFirst({
        where: eq(vendor.id, vendorId),
      });

      if (!dbVendor) return c.json({ error: "Vendor not found" }, 404);
      if (dbVendor.balance < amount)
        return c.json({ error: "Insufficient balance" }, 400);

      const transaction = await db.transaction(async (tx) => {
        const updatedCard = await tx
          .update(card)
          .set({
            balance: dbCard.balance + amount,
          })
          .where(eq(card.id, cardId))
          .returning();

        await tx
          .update(vendor)
          .set({
            balance: dbVendor.balance - amount,
          })
          .where(eq(vendor.id, vendorId))
          .returning();

        await tx.insert(statement).values({
          cardId,
          amount,
          from: dbCard.balance,
          to: updatedCard[0].balance,
          statementTypeEnum: convertPgEnum(statementTypeEnum).CHARGE,
          vendorId: dbCard.vendorId,
          userId: id,
        });

        return updatedCard;
      });

      return c.json({ card: transaction }, 200);
    }
  )
  .post(
    "/charge-by-product",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
        vendorId: z.string(),
        amount: z.number().positive(),

        gasStations: z.array(z.string()),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId, amount, vendorId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: and(eq(card.id, cardId), eq(card.vendorId, vendorId)),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);

      // TODO: Implement charge by product (but its too complex :( )

      return c.json({ message: "Success" }, 200);
    }
  );

export default chargeRoute;
