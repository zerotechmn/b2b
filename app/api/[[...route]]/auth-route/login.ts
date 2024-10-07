import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { comparePassword, hashPassword } from "../../tools/crypt";
import { Context } from "hono";

export default async function login(
  c: Context,
  email: string,
  password: string
) {
  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (
    !currentUser ||
    !(await comparePassword(
      password,
      currentUser?.password || currentUser?.firstTimePassword || ""
    ))
  ) {
    return c.json(
      {
        error: "Invalid user or password!",
      },
      404
    );
  }

  const refreshToken = await generateRefreshToken(currentUser);
  const hashedRefreshToken = await hashPassword(refreshToken);

  await db
    .update(user)
    .set({ refreshToken: hashedRefreshToken })
    .where(eq(user.email, email));

  return c.json(
    {
      user: currentUser,
      accessToken: await generateAccessToken(currentUser),
      refreshToken,
    },
    200
  );
}
