import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { vendor } from "./vendor";
import { user } from "./user";
import { driver } from "./driver";

export const productEnum = pgEnum("product_enum", [
  "A-80",
  "АИ-92",
  "Евро Аи-92",
  "АИ-95",
  "АИ-98",
  "Дизель",
  "Евро-ДТ",
  "Авто хий",
]);

export const card = pgTable("card", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardholderName: text("cardholder_name").notNull(),
  cardNumber: text("card_number").notNull(),
  balance: integer("balance").notNull().default(0),
  vendorId: uuid("vendor_id").references(() => vendor.id),
  currentLimit: integer("current_limit").notNull(),
  maxLimit: integer("max_limit").notNull(),
  // 1 or 2 or 3? forgot the meaning of these numbers
  limitInterval: text("limit_interval"),
  pin: integer("pin").notNull(),
  isActive: boolean("is_active").notNull(),
  driverId: uuid("driver_id").references(() => driver.id),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const cardRelations = relations(card, ({ one, many }) => ({
  vendor: one(vendor, {
    fields: [card.vendorId],
    references: [vendor.id],
  }),
  driver: one(driver, {
    fields: [card.driverId],
    references: [driver.id],
  }),
  productBalances: many(productBalance),
  cardRequests: many(cardRequest),
}));

export const productBalance = pgTable("product_balance", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id),
  product: productEnum("product").notNull(),
  balance: integer("balance").notNull().default(0),
  availableStations: uuid("available_stations").array().notNull(),
  // Warning: Same gas station and products can be duplicated across many productBalances.

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const productBalanceRelations = relations(productBalance, ({ one }) => ({
  card: one(card, {
    fields: [productBalance.cardId],
    references: [card.id],
  }),
}));

export const cardRequestStatusEnum = pgEnum("card_request_status_enum", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const cardRequest = pgTable("card_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id),
  requestedUserId: uuid("requested_user_id")
    .references(() => user.id)
    .notNull(),

  requestedCardCount: integer("requested_amount").notNull(),
  status: cardRequestStatusEnum("status").notNull(),
  fulfilledCardIds: uuid("fulfilled_card_ids")
    .references(() => card.id)
    .array()
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const cardRequestRelations = relations(cardRequest, ({ one, many }) => ({
  vendor: one(vendor, {
    fields: [cardRequest.vendorId],
    references: [vendor.id],
  }),
  fulfilledCards: many(card),
}));

export const statementTypeEnum = pgEnum("statement_type_enum", [
  "CHARGE",
  "WITHDRAW",
  "PURCHASE",
  "BONUS",
]);

export const statement = pgTable("statement", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id),
  amount: integer("amount").notNull(),
  from: integer("from").notNull(),
  to: integer("to").notNull(),
  details: text("details").notNull().default(""),
  statementTypeEnum: statementTypeEnum("type").notNull(),
  stationId: uuid("station_id"),
  vendorId: uuid("vendor_id").references(() => vendor.id),
  userId: uuid("user_id").references(() => user.id),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const statementRelations = relations(statement, ({ one }) => ({
  card: one(card, {
    fields: [statement.cardId],
    references: [card.id],
  }),
}));

export const transferActionEnum = pgEnum("transfer_action_enum", [
  "CARD_REQUEST_FULFILLMENT",
  "CARD_TRANSFER",
  "CARD_TRANSFER_RETURN",
  "DRIVER_ASSIGN",
  "DRIVER_UNASSIGN",
]);

export const cardTransferLog = pgTable("card_transfer_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  action: transferActionEnum("transfer_action").notNull(),
  fromVendorId: uuid("from_vendor_id").references(() => vendor.id),
  toVendorId: uuid("to_vendor_id").references(() => vendor.id),
  fromDriverId: uuid("from_driver_id").references(() => driver.id),
  toDriverId: uuid("to_driver_id").references(() => driver.id),
  details: text("details").notNull().default(""),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});
