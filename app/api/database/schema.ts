import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password"),

  companyId: text("company_id"),
  // role: text(""),

  firstTimePassword: text("firstTimePassword"),
  refreshToken: text("refreshToken").notNull().default("hi"),
});

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

export const company = pgTable("company", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  register: text("register").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  addressId: uuid("address_id")
    .notNull()
    .references(() => address.id),
});

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().defaultRandom(),
  balance: integer("balance").notNull(),
});

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  bagKhorooId: text("bag_khoroo_id").notNull(),
  details: text("details").notNull(),
  coordinate: text("email").notNull(),
  phone_number: text("phone_number"),
});

export const contractTypeEnum = pgEnum("contract_type_enum", [
  "pre_paid",
  "post_paid",
]);

export const contract = pgTable("contract", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  contractType: contractTypeEnum("contract_type").notNull(),
});

export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "monthly",
  "days_after",
  "custom",
]);

export const paymentPlan = pgTable("payment_plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contract.id),
  paymentType: paymentTypeEnum("payment_type").notNull(),
});

export const paymentDateTypeEnum = pgEnum("payment_date_type_enum", [
  "same_day_each_month",
  "last_weekday",
  "last_day_of_the_month",
  "days_after",
]);

export const paymentDateEachMonth = pgTable("payment_date_each_month", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentPlanId: uuid("payment_plan_id")
    .notNull()
    .references(() => paymentPlan.id),
  period: timestamp("period").notNull(), // 2024-06-01, 2024-07-01 etc. Represents the whole month.
  monthsAfter: integer("months_after").notNull().default(1), // Payments from 2024-06-01 to 2024-07-01 can be paid several months after. 1 will be calculated as next month.
  paymentDateType: paymentDateTypeEnum("payment_date_type").notNull(),
  sameDayEachMonth: integer("same_day_each_month"), // 1 to 31
  lastWeekday: integer("last_weekday"), // 1 to 7
  daysAfter: integer("days_after"), // If this option is chosen, months_after will be ignored.
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
