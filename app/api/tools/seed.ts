import * as dotenv from "dotenv";
import { db } from "../database/client";
import { role, user } from "../database/schema";
import { hashPassword } from "./crypt";
import { eq } from "drizzle-orm";

dotenv.config({ path: "@/.env.local" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  console.log("Seed start");
  await adminSeed();
  console.log("Seed done");
  process.exit();
};

main();

// Super admin seed
async function adminSeed() {
  const roleName = "SUPER_ADMIN";
  let adminRole = await db.query.role.findFirst({
    where: eq(role.name, roleName),
  });

  if (adminRole) {
    console.log("Super admin role already exists. Skipping...");
  } else {
    const response = await db
      .insert(role)
      .values({
        name: roleName,
        platform: "ADMIN",
        permissions: ["CREATE_CARD", "READ_CARD", "UPDATE_CARD", "DELETE_CARD"],
      })
      .returning();

    adminRole = response[0];
  }

  const adminEmail = "admin@shunkhlai.mn";
  const admin = await db.query.user.findFirst({
    where: eq(user.email, adminEmail),
  });

  if (admin) {
    console.log("Admin already exists. Skipping...");
    return;
  }

  const hashedPassword = await hashPassword("123456");

  await db.insert(user).values({
    roleId: adminRole.id,
    email: adminEmail,
    name: "admin",
    password: hashedPassword,
  });
}
