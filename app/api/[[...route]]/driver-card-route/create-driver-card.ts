import { z } from "zod";
import { db } from "../../database/client";
import { card } from "../../database/schema";

export const z_createDriverCard = z.object({
  cardholderName: z.string(),
  cardNumber: z.string(),
  balance: z.number(),
  currentLimit: z.number().optional(),
  maxLimit: z.number().optional(),
  limitInterval: z.string().optional(),
  pin: z.number(),
  isActive: z.boolean(),
});

const getCreateDriverCardBody = (
  data: z.infer<typeof z_createDriverCard>[]
) => {
  return data.map((item) => ({
    ...item,
    currentLimit: item.currentLimit || 0,
    maxLimit: item.maxLimit || 0,
    limitInterval: item.limitInterval || "",
  }));
};

export default async function createDriverCards(
  cards: z.infer<typeof z_createDriverCard>[]
) {
  const newCards = await db
    .insert(card)
    .values(getCreateDriverCardBody(cards))
    .returning();
  return newCards;
}
