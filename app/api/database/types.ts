import { card, cardRequest, role, statement, user, vendor } from "./schema";

export type User = typeof user.$inferSelect;
export type Role = typeof role.$inferSelect;
export type Vendor = typeof vendor.$inferSelect;
export type DriverCard = typeof card.$inferSelect;
export type Statement = typeof statement.$inferSelect;
export type CardRequest = typeof cardRequest.$inferSelect;
