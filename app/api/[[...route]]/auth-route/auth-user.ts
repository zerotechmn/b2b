import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { user } from "../../database/schema";

export const getAuthUser = async (email: string) => {
  return await db.query.user.findFirst({
    where: eq(user.email, email),
    with: {
      vendor: true,
      role: true,
    },
  });
};

export type AuthUser = Exclude<
  Awaited<ReturnType<typeof getAuthUser>>,
  undefined
>;
export interface JWTPayloadExtended extends AuthUser {
  iat?: number;
  exp?: number;
}
