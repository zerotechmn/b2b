import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  card,
  cardTransferLog,
  convertPgEnum,
  statement,
  statementTypeEnum,
  transferActionEnum,
  vendor,
} from "../../database/schema";
import { JWTPayloadExtended } from "../auth-route/auth-user";
import createDriverCards, { z_createDriverCard } from "./create-driver-card";

const driverCardRoute = new Hono()
  .get(
    "/list",
    zValidator(
      "json",
      z.object({
        offset: z.number().optional(),
        limit: z.number().optional(),
      })
    ),
    async (c) => {
      const { offset, limit } = c.req.valid("json");
      const cardList = await db.query.card.findMany({
        limit: limit || 10,
        offset: offset || 0,
        with: {
          vendor: true,
          driver: true,
          productBalances: true,
        },
      });

      return c.json({ cards: cardList, message: "Success" }, 200);
    }
  )
  .post("/create", zValidator("json", z_createDriverCard), async (c) => {
    const body = c.req.valid("json");

    const cards = await createDriverCards([body]);

    return c.json(
      {
        card: cards[0],
      },
      200
    );
  })
  .post(
    "/create-many",
    zValidator(
      "json",
      z.object({
        cards: z_createDriverCard.array(),
      })
    ),
    async (c) => {
      const cards = await createDriverCards(c.req.valid("json").cards);

      return c.json(
        {
          cardList: cards,
          message: "Success",
        },
        200
      );
    }
  )
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
  )
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
  )
  .post("/request", zValidator("json", z.object({})));

export default driverCardRoute;
