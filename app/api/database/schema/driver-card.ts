import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

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
  balance: text("balance").notNull(),
  vendorId: uuid("vendor_id").notNull(),
  currentLimit: text("current_limit").notNull(),
  maxLimit: text("max_limit").notNull(),
  limitInterval: text("limit_interval"),
  pin: text("pin").notNull(),
  isActive: text("is_active").notNull(),
  driverId: uuid("driver_id").notNull(),

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

export const productBalance = pgTable("product_balance", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id").notNull(),
  product: productEnum("product").notNull(),
  balance: text("balance").notNull(),
  availableStations: uuid("available_stations").array().notNull().default([]),
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

export const cardRequest = pgTable("card_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").notNull(),
  requestedCardCount: integer("requested_amount").notNull(),
  status: text("status").notNull(),
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

export const statement = pgTable("statement", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id").notNull(),
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
