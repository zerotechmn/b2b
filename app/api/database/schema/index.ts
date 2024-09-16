import { PgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { z } from "zod";

export * from "./user";
export * from "./vendor";

export function convertPgEnum(pgEnum: PgEnum<[string]>) {
  return z.enum(pgEnum.enumValues).Enum;
}

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  bagKhorooId: text("bag_khoroo_id").notNull(),
  details: text("details").notNull(),
  coordinate: text("email").notNull(),
  phone_number: text("phone_number"),
});

export const passwordResetToken = pgTable("password_reset_token", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
