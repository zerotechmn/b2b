import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { vendor } from "./vendor";
import { role } from "./user";
import { relations } from "drizzle-orm";

export const driver = pgTable("driver", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone").notNull(),
  vendorId: uuid("vendor_id").references(() => vendor.id),
  registerNumber: text("register_number"),
  carNumber: text("car_number"),
  refreshToken: text("refreshToken"),
});

export const driverRelations = relations(driver, ({ one }) => ({
  vendor: one(vendor, {
    fields: [driver.vendorId],
    references: [vendor.id],
  }),
}));
