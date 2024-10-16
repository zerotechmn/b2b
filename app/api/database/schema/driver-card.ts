import { relations } from "drizzle-orm";
import {
  boolean,
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
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id),
  currentLimit: integer("current_limit").notNull(),
  maxLimit: integer("max_limit").notNull(),
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
  // Same gas station and products can be duplicated across many productBalances.

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
  requestedCardCount: integer("requested_amount").notNull(),
  status: cardRequestStatusEnum("status").notNull(),
  requestedAt: text("requested_at").notNull(),

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

export const cardRequestRelations = relations(cardRequest, ({ one }) => ({
  vendor: one(vendor, {
    fields: [cardRequest.vendorId],
    references: [vendor.id],
  }),
}));

export const statement = pgTable("statement", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id),
  amount: text("amount").notNull(),
  from: integer("from").notNull(),
  to: integer("to").notNull(),
  details: text("details").notNull(),
  stationId: uuid("station_id").notNull(),

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
