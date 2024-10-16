import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { address, card, cardRequest } from ".";
import { relations } from "drizzle-orm";

export const vendor = pgTable("vendor", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  register: text("register").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  addressId: uuid("address_id").notNull(),
});

export const vendorRelations = relations(vendor, ({ one, many }) => ({
  contract: one(contract),
  address: one(address, {
    fields: [vendor.addressId],
    references: [address.id],
  }),
  wallet: one(wallet),
  cards: many(card),
  cardRequests: many(cardRequest),
}));

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id),
  balance: integer("balance").notNull(),
});

export const walletRelations = relations(wallet, ({ one }) => ({
  vendor: one(vendor, {
    fields: [wallet.vendorId],
    references: [vendor.id],
  }),
}));

export const contractTypeEnum = pgEnum("contract_type_enum", [
  "PRE_PAID",
  "POST_PAID",
]);

export const ownershipTypeEnum = pgEnum("ownership_type_enum", [
  "PERSONAL",
  "STATE",
]);

export const salesChannelEnum = pgEnum("sales_channel_enum", [
  "RETAIL",
  "BULK",
]);

export const eReceiptEnum = pgEnum("e_receipt_enum", [
  "BULK",
  "SINGLE",
  "RECEIPT_FREE",
]);

export const zoneEnum = pgEnum("zone_enum", [
  "Баруун бүс",
  "Говийн бүс",
  "Дархан бүс",
  "Зүүн бүс",
  "Орхон бүс",
  "Сайншанд бүс",
  "Төв бүс-1 бүс",
  "Төв бүс-2 бүс",
  "Хангайн бүс",
]);

export const localEntityEnum = pgEnum("local_entity_enum", [
  "Шунхлай ХХК",
  "Шунхлай Трейдинг ХХК",
  "Шунхлай Говь ХХК",
  "Шунхлай Петролиум ХХК",
  "Эс жи ханги гейт ХХК",
  "Эс эи шивээ хүрэн депо ХХК",
]);

export const contract = pgTable("contract", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id),
  contractType: contractTypeEnum("contract_type").notNull(),
  ownership: ownershipTypeEnum("ownership").notNull(),
  salesChannel: salesChannelEnum("sales_channel").notNull(),
  zone: zoneEnum("zone").notNull(),
  localEntity: localEntityEnum("local_entity").notNull(),
  discount: integer("discount").notNull().default(0),
  penaltyChargePercentage: integer("penalty_charge_percentage")
    .notNull()
    .default(0),
  maximumLoanAmount: integer("maximum_loan_amount").notNull().default(0),
  eReceipt: eReceiptEnum("e_receipt").notNull(),
  startDate: timestamp("start_date", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
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
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contract.id),
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
  weekOfMonth: integer("week_of_month"), // 1 to 5
  dayOfWeek: integer("day_of_week"), // 1 to 7
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
