import * as dotenv from "dotenv";
import { db } from "../../database/client";
import { role, user } from "../../database/schema";
import { hashPassword } from "../crypt";
import { eq } from "drizzle-orm";
import { adminSeed } from "./admin-seed";

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
