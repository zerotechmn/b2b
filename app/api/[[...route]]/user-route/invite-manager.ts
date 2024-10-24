import { eq } from "drizzle-orm";
import { Context } from "hono";
import { VENDOR_MANAGER_ROLENAME } from "../../constants";
import { db } from "../../database/client";
import { convertPgEnum, platformEnum, role, user } from "../../database/schema";
import { createPasswordResetToken } from "../auth-route";

export default async function inviteManager(
  c: Context,
  email: string,
  vendorId: string
) {
  let vendorManagerRole = await db.query.role
    .findFirst({
      where: eq(role.name, VENDOR_MANAGER_ROLENAME),
    })
    .then((res) => res);

  // TODO: Delete later because this role should always exist
  if (!vendorManagerRole) {
    const newRole = await db
      .insert(role)
      .values({
        name: VENDOR_MANAGER_ROLENAME,
        platform: convertPgEnum(platformEnum).VENDOR,
        permissions: [],
      })
      .returning();
    vendorManagerRole = newRole[0];
  }

  let currentUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!currentUser) {
    const newUsers = await db
      .insert(user)
      .values({
        email,
        name: "New User",
        vendorId,
        roleId: vendorManagerRole.id,
      })
      .returning();

    currentUser = newUsers[0];
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
        '&isReset="false',
    },
    200
  );
}
