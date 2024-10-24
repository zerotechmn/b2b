import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  card,
  cardTransferLog,
  convertPgEnum,
  transferActionEnum,
} from "../../database/schema";
import { JWTPayloadExtended } from "../auth-route/auth-user";

const cardActionsRoute = new Hono()
  .post(
    "/assign-vendor",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
        vendorId: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId, vendorId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: eq(card.id, cardId),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);
      if (dbCard.vendorId)
        return c.json({ error: "Card already assigned" }, 400);

      const transaction = await db.transaction(async (tx) => {
        const updatedCard = await tx
          .update(card)
          .set({ vendorId })
          .where(eq(card.id, cardId));

        await tx.insert(cardTransferLog).values({
          cardId,
          userId: id as string,
          toVendorId: vendorId,
          action: convertPgEnum(transferActionEnum).CARD_TRANSFER,
        });

        return updatedCard;
      });

      return c.json({ card: transaction }, 200);
    }
  )
  .post(
    "/remove-vendor",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: eq(card.id, cardId),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);

      const transaction = await db.transaction(async (tx) => {
        const updatedCard = await tx
          .update(card)
          .set({ vendorId: null })
          .where(eq(card.id, cardId))
          .returning();

        await tx.insert(cardTransferLog).values({
          cardId,
          userId: id as string,
          fromVendorId: dbCard.vendorId,
          action: convertPgEnum(transferActionEnum).CARD_TRANSFER_RETURN,
        });

        return updatedCard;
      });

      return c.json({ card: transaction }, 200);
    }
  )
  .post(
    "/assign-driver",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
        driverId: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId, driverId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: eq(card.id, cardId),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);

      const transaction = await db.transaction(async (tx) => {
        const updatedCard = await tx
          .update(card)
          .set({ driverId })
          .where(eq(card.id, cardId))
          .returning();

        await tx.insert(cardTransferLog).values({
          cardId,
          userId: id as string,
          toDriverId: driverId,
          action: convertPgEnum(transferActionEnum).DRIVER_ASSIGN,
        });

        return updatedCard;
      });

      return c.json({ card: transaction }, 200);
    }
  )
  .post(
    "/remove-driver",
    zValidator(
      "json",
      z.object({
        cardId: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.get("jwtPayload") as JWTPayloadExtended;
      const { cardId } = c.req.valid("json");
      const dbCard = await db.query.card.findFirst({
        where: eq(card.id, cardId),
      });

      if (!dbCard) return c.json({ error: "Card not found" }, 404);

      const transaction = await db.transaction(async (tx) => {
        const updatedCard = await tx
          .update(card)
          .set({ driverId: null })
          .where(eq(card.id, cardId))
          .returning();

        await tx.insert(cardTransferLog).values({
          cardId,
          userId: id as string,
          fromDriverId: dbCard.driverId,
          action: convertPgEnum(transferActionEnum).DRIVER_UNASSIGN,
        });

        return updatedCard;
      });

      return c.json({ card: transaction }, 200);
    }
  );

export default cardActionsRoute;
