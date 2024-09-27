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

const testingJson = {
  name: "Vendor Name",
  register: "123",
  phoneNumber: "123",
  email: "",
  address: {
    bagKhorooId: "123",
    details: "123",
    coordinate: "123",
    phone_number: "123",
  },
  contract: {
    expiresAt: "2024-09-26T03:40:44Z",
    ownership: "PERSONAL",
    salesChannel: "RETAIL",
    zone: "Баруун бүс",
    localEntity: "Баруун бүс",
    discount: 0,
    penaltyChargePercentage: 0,
    maximumLoanAmount: 0,
    eReceipt: "BULK",
    contractType: "POST_PAID",
    paymentType: "MONTHLY",
    period: "2024-09-26T03:40:44Z",
    monthsAfter: 1,
    paymentDateType: "SAME_DAY_EACH_MONTH",
    sameDayEachMonth: 1,
    weekOfMonth: 1,
    dayOfWeek: 1,
    daysAfter: 1,
  },
  managerEmail: "",
};

export const z_contract = z.object({
  expiresAt: z.coerce.date(),
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
  period: z.coerce.date(),
  monthsAfter: z.number(),
  paymentDateType: z.enum(paymentDateTypeEnum.enumValues),
  sameDayEachMonth: z.number().optional(),
  weekOfMonth: z.number().optional(),
  dayOfWeek: z.number().optional(),
  daysAfter: z.number(),
});

interface Props extends z.infer<typeof z_contract> {
  vendorId: string;
}

export default async function createContract({
  vendorId,
  paymentType,
  period,
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
        period,
        monthsAfter,
        paymentDateType,
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
