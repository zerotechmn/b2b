import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import createDriverCard, { z_createDriver } from "./create-driver-card";
import { db } from "../../database/client";
import { z } from "zod";

const driverCardRoute = new Hono()
  // with offset and limit
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
        offset: offset || 1,
        with: {
          vendor: true,
          driver: true,
          productBalances: true,
        },
      });

      return c.json({ cards: cardList, message: "Success" }, 200);
    }
  )
  .post("/create", zValidator("json", z_createDriver), async (c) => {
    const body = c.req.valid("json");
    // TODO: do props validation

    const card = await createDriverCard(body);

    return c.json(
      {
        card,
      },
      200
    );
  })
  .post("/list", async (c) => {
    const cardList = await db.query.card.findMany({
      with: {
        vendor: true,
      },
    });

    return c.json(
      {
        cardList,
        message: "Success",
      },
      200
    );
  });

export default driverCardRoute;
