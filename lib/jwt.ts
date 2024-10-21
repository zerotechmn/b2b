import { Context, Next } from "hono";
import { jwt, sign } from "hono/jwt";
import { ContextType } from "../app/api/[[...route]]/route";
import { AuthUser } from "@/app/api/[[...route]]/auth-route/login";

export function jwtMiddleware(c: Context<ContextType>, next: Next) {
  const mw = jwt({
    secret: process.env.JWT_SECRET!,
  });
  return mw(c, next);
}

export async function generateAccessToken(user: AuthUser) {
  return await sign(
    {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
    },
    process.env.JWT_SECRET!
  );
}

export async function generateRefreshToken(user: AuthUser) {
  return await sign(user, process.env.JWT_REFRESH_SECRET!);
}

export function generateBase62Token(length: number): string {
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * base62Chars.length);
    token += base62Chars[randomIndex];
  }

  return token;
}
