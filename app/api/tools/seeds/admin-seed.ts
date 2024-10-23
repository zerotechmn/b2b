import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { convertPgEnum, platformEnum, role, user } from "../../database/schema";
import { hashPassword } from "../crypt";
import {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  SUPER_ADMIN_ROLE_NAME,
} from "./constants";

export async function adminSeed() {
  console.log("Creating super admin...");
  let adminRole = await db.query.role.findFirst({
    where: eq(role.name, SUPER_ADMIN_ROLE_NAME),
  });

  if (adminRole) {
    console.log("Super admin role already exists. Skipping...");
  } else {
    const response = await db
      .insert(role)
      .values({
        name: SUPER_ADMIN_ROLE_NAME,
        platform: convertPgEnum(platformEnum).ADMIN,
        permissions: ["CREATE_CARD", "READ_CARD", "UPDATE_CARD", "DELETE_CARD"],
      })
      .returning();

    adminRole = response[0];
  }

  const admin = await db.query.user.findFirst({
    where: eq(user.email, SUPER_ADMIN_EMAIL),
  });

  if (admin) {
    console.log("Admin already exists. Skipping...");
    return;
  }

  const hashedPassword = await hashPassword(SUPER_ADMIN_PASSWORD);

  await db.insert(user).values({
    roleId: adminRole.id,
    email: SUPER_ADMIN_EMAIL,
    name: "admin",
    password: hashedPassword,
  });

  console.log("Super admin created successfully.");
}

export async function adminSalesManagerSeed() {
  console.log("Creating super admin...");
  let adminRole = await db.query.role.findFirst({
    where: eq(role.name, SUPER_ADMIN_ROLE_NAME),
  });

  if (adminRole) {
    console.log("Super admin role already exists. Skipping...");
  } else {
    const response = await db
      .insert(role)
      .values({
        name: SUPER_ADMIN_ROLE_NAME,
        platform: convertPgEnum(platformEnum).ADMIN,
        permissions: ["CREATE_CARD", "READ_CARD", "UPDATE_CARD", "DELETE_CARD"],
      })
      .returning();

    adminRole = response[0];
  }

  const admin = await db.query.user.findFirst({
    where: eq(user.email, SUPER_ADMIN_EMAIL),
  });

  if (admin) {
    console.log("Admin already exists. Skipping...");
    return;
  }

  const hashedPassword = await hashPassword(SUPER_ADMIN_PASSWORD);

  await db.insert(user).values({
    roleId: adminRole.id,
    email: SUPER_ADMIN_EMAIL,
    name: "admin",
    password: hashedPassword,
  });

  console.log("Super admin created successfully.");
}
