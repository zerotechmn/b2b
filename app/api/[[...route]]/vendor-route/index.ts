import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  address,
  contract,
  contractTypeEnum,
  paymentDateEachMonth,
  paymentDateTypeEnum,
  paymentPlan,
  paymentTypeEnum,
  vendor,
  wallet,
} from "../../database/schema";

const vendorRoute = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        register: z.string(),
        phoneNumber: z.string(),
        email: z.string(),
        address: z.object({
          bagKhorooId: z.string(),
          details: z.string(),
          coordinate: z.string(),
          phone_number: z.string(),
        }),
      })
    ),
    async (c) => {
      const {
        name,
        register,
        phoneNumber,
        email,
        address: addressData,
      } = c.req.valid("json");

      const createdVendor = await db.transaction(async (tx) => {
        const newAddress = await tx
          .insert(address)
          .values({
            bagKhorooId: addressData.bagKhorooId,
            details: addressData.details,
            coordinate: addressData.coordinate,
            phone_number: addressData.phone_number,
          })
          .returning();

        const newVendor = await tx
          .insert(vendor)
          .values({
            name,
            register,
            phoneNumber,
            email,
            addressId: newAddress[0].id,
          })
          .returning();

        await tx
          .insert(wallet)
          .values({
            balance: 0,
            vendorId: newVendor[0].id,
          })
          .returning();

        return newVendor[0];
      });

      return c.json(
        { vendor: createdVendor, message: "Vendor created successfully!" },
        200
      );
    }
  )
  .post(
    "/create-contract",
    zValidator(
      "json",
      z.object({
        vendorId: z.string(),
        expiresAt: z.date(),
        contractType: z.enum(contractTypeEnum.enumValues),
        paymentType: z.enum(paymentTypeEnum.enumValues),
        period: z.date(),
        monthsAfter: z.number(),
        paymentDateType: z.enum(paymentDateTypeEnum.enumValues),
        sameDayEachMonth: z.number(),
        lastWeekday: z.number(),
        daysAfter: z.number(),
      })
    ),
    async (c) => {
      const {
        vendorId,
        expiresAt,
        contractType,
        paymentType,
        period,
        monthsAfter,
        paymentDateType,
        sameDayEachMonth,
        lastWeekday,
        daysAfter,
      } = c.req.valid("json");

      const createdContract = await db.transaction(async (tx) => {
        const newContract = await tx
          .insert(contract)
          .values({
            vendorId,
            expiresAt,
            contractType,
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
            lastWeekday,
            daysAfter,
          })
          .returning();

        return newContract[0];
      });

      return c.json(
        {
          contract: createdContract,
          message: "Contract created successfully!",
        },
        200
      );
    }
  );

export default vendorRoute;
