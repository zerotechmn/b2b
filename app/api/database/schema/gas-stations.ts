import { relations } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";

export const product = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type"),
  productId: integer("product_id"),
  shtsCode: text("shts_code"),
  productCode: text("product_code"),
  productName: text("product_name"),
  uom: text("uom"),
  vattype: text("vattype"),
  price: text("price"),
  barcode: text("barcode"),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const gasStation = pgTable("gas_station", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  shtsCode: text("shts_code"),
  lat: text("lat"),
  long: text("long"),
  phone: text("phone"),
  isOilCenter: text("is_oil_center"),
  isShtsGas: text("is_shts_gas"),
  address: text("address"),
  companyId: integer("company_id"),
});

export const productRelations = relations(product, ({ one }) => ({
  gasStation: one(gasStation, {
    fields: [product.shtsCode],
    references: [gasStation.shtsCode],
  }),
}));
