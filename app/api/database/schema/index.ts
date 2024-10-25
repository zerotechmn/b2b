import { PgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./user";
export * from "./vendor";
export * from "./driver-card";
export * from "./driver";
export * from "./gas-stations";

export function convertPgEnum<T extends [string, ...string[]]>(
  pgEnum: PgEnum<T>
) {
  return z.enum(pgEnum.enumValues).Enum;
}

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  bagKhorooId: text("bag_khoroo_id").notNull(),
  details: text("details").notNull(),
  coordinate: text("email").notNull(),
  phoneNumber: text("phone_number"),
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

export const passwordResetTokenRelations = relations(
  passwordResetToken,
  ({ one }) => ({
    user: one(user, {
      fields: [passwordResetToken.userId],
      references: [user.id],
    }),
  })
);
