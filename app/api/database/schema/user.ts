import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { vendor } from "./vendor";

export const permissionEnum = pgEnum("permission_enum", [
  "CREATE_CARD",
  "READ_CARD",
  "UPDATE_CARD",
  "DELETE_CARD",
]);

export const platformEnum = pgEnum("platform_enum", ["ADMIN", "VENDOR"]);

export const role = pgTable("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  platform: platformEnum("platform").notNull(),
  permissions: permissionEnum("permissions").array().notNull(),
});

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password"),
  // vendorId: uuid("vendor_id"),
  roleId: uuid("role_id").notNull(),
  firstTimePassword: text("firstTimePassword"),
  refreshToken: text("refreshToken").notNull().default("hi"),
});

export const usersRelations = relations(user, ({ one }) => ({
  // vendor: one(vendor, {
  //   fields: [user.vendorId],
  //   references: [vendor.id],
  // }),
  role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
