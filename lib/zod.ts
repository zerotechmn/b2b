import { number, object, string } from "zod";

export const signInSchema = object({
  email: string(),
  password: string(),
});

export const vendorCreateSchema = object({
  name: string(),
  register: string(),
  phoneNumber: string(),
  email: string(),
  address: object({
    bagKhorooId: string(),
    details: string(),
    coordinate: string(),
    phone_number: string(),
  }),
  contract: object({
    expiresAt: string(),
    contractType: string(),
    paymentType: string(),
    period: string(),
    monthsAfter: number(),
    paymentDateType: string(),
    sameDayEachMonth: string(),
    weekOfMonth: string(),
    dayOfWeek: string(),
    daysAfter: string(),
  }),

  managerEmail: string(),
});
