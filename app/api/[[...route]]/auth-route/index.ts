import { isWithinExpirationDate } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";
import { generateAccessToken, generateBase62Token } from "../../../../lib/jwt";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { comparePassword, hashPassword } from "../../tools/crypt";
import { passwordResetToken } from "../../database/schema";
import login from "./login";

const authRoute = new Hono()
  .post(
    "/login",
    zValidator(
      "json",
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      return login(c, email, password);
    }
  )
  .post(
    "/logout",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async (c) => {
      const { userId } = c.req.valid("json");

      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.userId, userId))
        .catch(() => null);

      return c.json(
        {
          message: "Logged out",
        },
        200
      );
    }
  )
  .post(
    "/token",
    zValidator(
      "json",
      z.object({
        number: z.number(),
        email: z.string(),
        refreshToken: z.string(),
      })
    ),
    async (c) => {
      const { email, refreshToken } = c.req.valid("json");
      if (!refreshToken) return c.json({ message: "Unauthenticated" }, 401);

      const currentUser = await db.query.user
        .findFirst({
          where: eq(user.email, email),
        })
        .catch(() => null);

      if (
        !(await comparePassword(refreshToken, currentUser?.refreshToken || ""))
      )
        return c.json({ message: "Invalid refresh token" }, 403);

      const { exp, ...rest } = await verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );

      return c.json(
        { accessToken: await generateAccessToken({ ...rest }) },
        200
      );
    }
  )
  .post(
    "/verify-reset-token",
    zValidator("json", z.object({ token: z.string(), userId: z.string() })),
    async (c) => {
      const { token, userId } = c.req.valid("json");

      const resetToken = await verifyResetToken(token, userId);

      if (!resetToken) {
        return c.json({ message: "Invalid or expired token!" }, 400);
      }

      const resetUser = await db.query.user.findFirst({
        where: eq(user.id, userId),
      });

      return c.json({ user: resetUser }, 200);
    }
  )
  .post(
    "/reset-password",
    zValidator("json", z.object({ email: z.string() })),
    async (c) => {
      const { email } = c.req.valid("json");

      const currentUser = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (!currentUser) {
        return c.json({ error: "User with this email not found!" }, 404);
      }

      const resetToken = await createPasswordResetToken(currentUser.id);

      // TODO: Send email instead of returning the link
      return c.json(
        {
          link:
            "/auth/change-password?token=" +
            resetToken +
            "&userId=" +
            currentUser.id +
            '&isReset="true',
        },
        200
      );

      // TODO: Implement rate limiting based on IP address
    }
  )
  .post(
    "/reset-password/:token",
    zValidator("json", z.object({ password: z.string(), userId: z.string() })),
    async (c) => {
      const { password, userId } = c.req.valid("json");
      const verificationToken = c.req.param("token");

      if (password.length < 8) {
        return c.json(
          { message: "Password must be longer than 8 characters" },
          400
        );
      }

      const token = await verifyResetToken(verificationToken, userId);

      if (token) {
        await db
          .delete(passwordResetToken)
          .where(eq(passwordResetToken.id, token.id));
      }

      if (!token || !isWithinExpirationDate(token.expiresAt)) {
        return c.json({ message: "Invalid or expired token!" }, 400);
      }

      const passwordHash = await hashPassword(password);
      await db
        .update(user)
        .set({ password: passwordHash })
        .where(eq(user.id, token.userId));

      return c.json({ message: "Password reset successful" }, 200);
    }
  );

export default authRoute;

export async function createPasswordResetToken(
  userId: string,
  expiresAfter?: number
): Promise<string> {
  // invalidate all existing tokens
  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.userId, userId));

  const tokenId = generateBase62Token(25);
  const tokenHash = await hashPassword(tokenId);

  await db.insert(passwordResetToken).values({
    userId,
    tokenHash,
    expiresAt: new Date(
      new Date().getTime() + (expiresAfter || 2 * 60 * 60 * 1000)
    ), // 2h from now.
  });

  return tokenId;
}

async function verifyResetToken(token: string, userId: string) {
  const resetToken = await db.query.passwordResetToken.findFirst({
    where: eq(passwordResetToken.userId, userId),
  });

  const isValidToken = await comparePassword(
    token,
    resetToken?.tokenHash || ""
  );

  if (
    !isValidToken ||
    !resetToken ||
    !isWithinExpirationDate(resetToken?.expiresAt)
  ) {
    return null;
  }

  return resetToken;
}
