import { Context, Next } from "hono";
import { jwt, sign } from "hono/jwt";
import { ContextType } from "../app/api/[[...route]]/route";

export function jwtMiddleware(c: Context<ContextType>, next: Next) {
  const mw = jwt({
    secret: process.env.JWT_SECRET!,
  });
  return mw(c, next);
}

export async function generateAccessToken(user: any) {
  return await sign(
    {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    },
    process.env.JWT_SECRET!
  );
}

export async function generateRefreshToken(user: any) {
  return await sign(user, process.env.JWT_REFRESH_SECRET!);
}
