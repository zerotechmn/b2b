import { eq } from "drizzle-orm";
import { Context } from "hono";
import { generateAccessToken, generateRefreshToken } from "../../../../lib/jwt";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { comparePassword, hashPassword } from "../../tools/crypt";
import { role } from "./../../database/schema";
import { getAuthUser } from "./auth-user";

export default async function login(
  c: Context,
  email: string,
  password: string
) {
  const currentUser = await getAuthUser(email);

  if (
    !currentUser ||
    !(await comparePassword(password, currentUser?.password || ""))
  ) {
    return c.json(
      {
        error: "Invalid user or password!",
      },
      404
    );
  }

  const userRole = await db.query.role.findFirst({
    where: eq(role.id, currentUser.roleId),
  });

  const refreshToken = await generateRefreshToken(currentUser);
  const hashedRefreshToken = await hashPassword(refreshToken);

  await db
    .update(user)
    .set({ refreshToken: hashedRefreshToken })
    .where(eq(user.email, email));

  const { password: _, ...returnUser } = currentUser;

  return c.json(
    {
      user: {
        ...returnUser,
        role: userRole,
      },
      accessToken: await generateAccessToken(currentUser),
      refreshToken,
    },
    200
  );
}
