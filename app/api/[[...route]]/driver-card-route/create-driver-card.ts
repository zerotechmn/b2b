import { z } from "zod";
import { db } from "../../database/client";
import { card } from "../../database/schema";

const createJson = {
  cardholderName: "Amgalanbayar",
  cardNumber: "1234567890",
  balance: 10000,
  currentLimit: 1000,
  maxLimit: 10000,
  limitInterval: "month",
  pin: 1234,
  isActive: true,
};

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
