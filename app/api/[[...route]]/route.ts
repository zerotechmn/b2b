import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { jwtMiddleware } from "../../../lib/jwt";
import authRoute from "./auth-route";
import usersRoute from "./user-route";
import vendorRoute from "./vendor-route";
import driverCardRoute from "./driver-card-route";
import productRoute from "./product-route";

// Can run on the edge if we need to.
// export const runtime = "edge";

type Bindings = {
  JWT_SECRET: string;
};

export type ContextType = {
  Variables: JwtVariables;
  Bindings: Bindings;
};

const app = new Hono<ContextType>().basePath("/api");

app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Define which routes are protected by JWT
app.use("/user/*", jwtMiddleware);
app.use("/vendor/*", jwtMiddleware);
app.use("/driver-card/*", jwtMiddleware);
app.use("/product/*", jwtMiddleware);

const route = app
  .route("/authenticate", authRoute)
  .route("/user", usersRoute)
  .route("/vendor", vendorRoute)
  .route("/product", productRoute)
  .route("/driver-card", driverCardRoute)
  .get("/health", (c) => {
    return c.json({
      message: "Hello!",
      health: "ok",
    });
  });

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
