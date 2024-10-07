import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const driverCardRoute = new Hono()
  .get("/", (c) =>
    c.json({
      user: {
        name: "fritz",
        password: "",
      },
    })
  )
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        email: z.string(),
        vendorId: z.string(),
      })
    ),
    async (c) => {
      const { email, vendorId } = c.req.valid("json");
    }
  );

export default driverCardRoute;
