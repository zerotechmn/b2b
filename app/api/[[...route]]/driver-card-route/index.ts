import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { driver } from "../../database/schema";
import cardActionsRoute from "./actions";
import chargeRoute from "./charge";
import createDriverCards, { z_createDriverCard } from "./create";
import cardRequestRoute from "./request";

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
  .get("/phone/:phone", async (c) => {
    const phone = c.req.param("phone");
    const dbDriver = await db.query.driver.findFirst({
      where: eq(driver.phone, phone),
    });
    if (!dbDriver) return c.json({ error: "Driver not found" }, 404);
    return c.json({ driver: dbDriver }, 200);
  })
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
  .route("/", cardActionsRoute)
  .route("/", chargeRoute)
  .route("/request", cardRequestRoute);

export default driverCardRoute;
