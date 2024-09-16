import * as dotenv from "dotenv";
import { db } from "../database/client";
import { user } from "../database/schema";
import { hashPassword } from "./crypt";
import { eq } from "drizzle-orm";

dotenv.config({ path: "@/.env.local" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  console.log("Seed start");
  await adminSeed();
  console.log("Seed done");
};

main();

// Super admin seed
async function adminSeed() {
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
    email: adminEmail,
    name: "admin",
    password: hashedPassword,
  });
}
