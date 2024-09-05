import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./client";
import * as schema from "./schema";

async function main() {
  try {
    console.log("Migrating database...", migrationClient);
    await migrate(drizzle(migrationClient, { schema }), {
      migrationsFolder: "./app/api/drizzle",
    });

    await migrationClient.end();
    console.log("Database migrated successfully!");
  } catch (e: any) {
    throw new Error(e);
  }
}

main();
