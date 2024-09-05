import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { jwtMiddleware } from "../../../lib/jwt";
import authRoute from "./auth-route";
import usersRoute from "./users-route";

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
app.use("/users/*", jwtMiddleware);

const route = app
  .route("/auth", authRoute)
  .route("/users", usersRoute)
  .get("/health", (c) => {
    return c.json({
      message: "Hello Next.js!",
      health: "ok",
    });
  });

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
