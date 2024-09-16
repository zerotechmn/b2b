import { eq } from "drizzle-orm";
import { Context } from "hono";
import { cookies } from "next/headers";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { comparePassword } from "../../tools/crypt";

export default async function logout(
  c: Context<
    {},
    "/logout",
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

  return c.json(
    {
      user: currentUser,
    },
    200
  );
}
