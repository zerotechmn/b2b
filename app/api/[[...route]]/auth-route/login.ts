import { eq } from "drizzle-orm";
import { Context } from "hono";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";
import { comparePassword, hashPassword } from "../../tools/crypt";

export default async function login(
  c: Context<
    {},
    "/login",
    {
      in: {
        json: {
          email: string;
          password: string;
        };
      };
      out: {
        json: {
          email: string;
          password: string;
        };
      };
    }
  >
) {
  const { email, password } = c.req.valid("json");

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
