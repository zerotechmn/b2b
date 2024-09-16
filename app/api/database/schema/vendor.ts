import {
  integer,
  PgEnum,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { address } from ".";
import { relations } from "drizzle-orm";

export const contractTypeEnum = pgEnum("contract_type_enum", [
  "PRE_PAID",
  "POST_PAID",
]);

export const vendor = pgTable("vendor", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  register: text("register").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  addressId: uuid("address_id").notNull(),
});

export const vendorRelations = relations(vendor, ({ one }) => ({
  contracts: one(contract),
  address: one(address, {
    fields: [vendor.addressId],
    references: [address.id],
  }),
  wallet: one(wallet),
}));

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull(),
  balance: integer("balance").notNull(),
});

export const walletRelations = relations(wallet, ({ one }) => ({
  vendor: one(vendor, {
    fields: [wallet.vendorId],
    references: [vendor.id],
  }),
}));

export const contract = pgTable("contract", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  contractType: contractTypeEnum("contract_type").notNull(),
});

export const contractRelations = relations(contract, ({ one }) => ({
  paymentPlan: one(paymentPlan),
  vendor: one(vendor, {
    fields: [contract.vendorId],
    references: [vendor.id],
  }),
}));

export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "MONTHLY",
  "DAYS_AFTER",
  "CUSTOM",
]);

export const paymentPlan = pgTable("payment_plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull(),
  paymentType: paymentTypeEnum("payment_type").notNull(),
});

export const paymentPlanRelations = relations(paymentPlan, ({ one }) => ({
  contract: one(contract, {
    fields: [paymentPlan.contractId],
    references: [contract.id],
  }),
}));

export const paymentDateTypeEnum = pgEnum("payment_date_type_enum", [
  "SAME_DAY_EACH_MONTH",
  "LAST_WEEKDAY",
  "LAST_DAY_OF_THE_MONTH",
  "DAYS_AFTER",
]);

export const paymentDateEachMonth = pgTable("payment_date_each_month", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentPlanId: uuid("payment_plan_id").notNull(),
  period: timestamp("period").notNull(), // 2024-06-01, 2024-07-01 etc. Represents the whole month.
  monthsAfter: integer("months_after").notNull().default(1), // Payments from 2024-06-01 to 2024-07-01 can be paid several months after. 1 will be calculated as next month.
  paymentDateType: paymentDateTypeEnum("payment_date_type").notNull(),
  sameDayEachMonth: integer("same_day_each_month"), // 1 to 31
  lastWeekday: integer("last_weekday"), // 1 to 7
  daysAfter: integer("days_after"), // If this option is chosen, months_after will be ignored.
});

export const paymentDateEachMonthRelations = relations(
  paymentDateEachMonth,
  ({ one }) => ({
    paymentPlan: one(paymentPlan, {
      fields: [paymentDateEachMonth.paymentPlanId],
      references: [paymentPlan.id],
    }),
  })
);
