import { z } from "zod";
import { db } from "../../database/client";
import { card } from "../../database/schema";

// create driver-card props
export const z_createDriver = z.object({
  cardholderName: z.string(),
  cardNumber: z.string(),
  balance: z.number(),
  vendorId: z.string(),
  currentLimit: z.number().optional(),
  maxLimit: z.number().optional(),
  limitInterval: z.string().optional(),
  pin: z.number(),
  isActive: z.boolean(),
  driverId: z.string().optional(),
});

export default async function createDriverCard({
  cardholderName,
  cardNumber,
  balance,
  vendorId,
  currentLimit,
  maxLimit,
  limitInterval,
  pin,
  isActive,
  driverId,
}: z.infer<typeof z_createDriver>) {
  const newCard = await db.insert(card).values({
    cardholderName,
    balance,
    cardNumber,
    vendorId,
    currentLimit: currentLimit || 0,
    maxLimit: maxLimit || 0,
    limitInterval: limitInterval || "",
    pin,
    isActive,
    driverId,
  });

  return newCard[0];
}
