import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import createDriverCard, { z_createDriver } from "./create-driver-card";
import { db } from "../../database/client";

const driverCardRoute = new Hono()
  .get("/", (c) =>
    c.json({
      user: {
        name: "fritz",
        password: "",
      },
    })
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
    // TODO: do props validation

    const cardList = await db.query.card.findMany();

    return c.json(
      {
        cardList,
        message: "Success",
      },
      200
    );
  });

export default driverCardRoute;
