import { z } from "zod";
import { db } from "../../database/client";
import {
  contract,
  eReceiptEnum,
  localEntityEnum,
  ownershipTypeEnum,
  paymentDateEachMonth,
  paymentPlan,
  salesChannelEnum,
  zoneEnum,
} from "../../database/schema";
import {
  contractTypeEnum,
  paymentDateTypeEnum,
  paymentTypeEnum,
} from "./../../database/schema";

export const z_contract = z.object({
  // startDate: z.coerce.date(),
  // expiresAt: z.coerce.date(),
  ownership: z.enum(ownershipTypeEnum.enumValues),
  salesChannel: z.enum(salesChannelEnum.enumValues),
  zone: z.enum(zoneEnum.enumValues),
  localEntity: z.enum(localEntityEnum.enumValues),
  discount: z.number(),
  penaltyChargePercentage: z.number(),
  maximumLoanAmount: z.number(),
  eReceipt: z.enum(eReceiptEnum.enumValues),
  contractType: z.enum(contractTypeEnum.enumValues),
  paymentType: z.enum(paymentTypeEnum.enumValues),
  // period: z.coerce.date(),
  monthsAfter: z.number().optional(),
  paymentDateType: z.enum(paymentDateTypeEnum.enumValues).optional(),
  sameDayEachMonth: z.number().optional(),
  weekOfMonth: z.number().optional(),
  dayOfWeek: z.number().optional(),
  daysAfter: z.number().optional(),
});

interface Props extends z.infer<typeof z_contract> {
  vendorId: string;
}

export default async function createContract({
  vendorId,
  paymentType,
  // period,
  monthsAfter,
  paymentDateType,
  sameDayEachMonth,
  weekOfMonth,
  dayOfWeek,
  daysAfter,
  ...rest
}: Props) {
  const createdContract = await db.transaction(async (tx) => {
    const newContract = await tx
      .insert(contract)
      .values({
        vendorId,
        startDate: new Date(),
        expiresAt: new Date(),
        ...rest,
      })
      .returning();

    const newPaymentPlan = await tx
      .insert(paymentPlan)
      .values({
        contractId: newContract[0].id,
        paymentType,
      })
      .returning();

    await tx
      .insert(paymentDateEachMonth)
      .values({
        paymentPlanId: newPaymentPlan[0].id,
        period: new Date(),
        monthsAfter,
        paymentDateType: paymentDateType!,
        sameDayEachMonth,
        weekOfMonth,
        dayOfWeek,
        daysAfter,
      })
      .returning();

    return newContract[0];
  });

  return createdContract;
}
