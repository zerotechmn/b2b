import { generateBase62Token } from "@/lib/jwt";
import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { role, convertPgEnum, platformEnum, user } from "../../database/schema";
import { hashPassword } from "../../tools/crypt";

const vendorManagerRoleName = "VENDOR_MANAGER";

export default async function inviteManager(email: string, vendorId: string) {
  let vendorManagerRole = await db.query.role
    .findFirst({
      where: eq(role.name, vendorManagerRoleName),
    })
    .then((res) => res);

  // TODO: Delete later because this role should always exist
  if (!vendorManagerRole) {
    const newRole = await db
      .insert(role)
      .values({
        name: vendorManagerRoleName,
        platform: convertPgEnum(platformEnum).VENDOR,
        permissions: [],
      })
      .returning();
    vendorManagerRole = newRole[0];
  }

  const passwordToken = generateBase62Token(8);
  const passwordHash = await hashPassword(passwordToken);

  // TODO: Send email to new user with passwordToken

  const newUsers = await db
    .insert(user)
    .values({
      email,
      name: "New User",
      vendorId,
      firstTimePassword: passwordHash,
      roleId: vendorManagerRole.id,
    })
    .returning();

  return newUsers[0];
}
