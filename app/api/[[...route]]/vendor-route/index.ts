import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import {
  address,
  contract,
  paymentDateEachMonth,
  paymentPlan,
  vendor,
} from "../../database/schema";
import createContract, { z_contract } from "./create-contract";
import { rest } from "lodash";

export const z_vendorCreateSchema = z.object({
  name: z.string().min(2, "Нэр хамгийн багадаа 2 тэмдэгтээс их байна"),
  register: z
    .string()
    .min(2, "Байгууллагийн регистр хамгийн багадаа 2 тэмдэгтээс их байна"),
  phoneNumber: z.string().min(8, "Утасны дугаар 8 оронтой байх ёстой"),
  email: z.string().email("Имайл формат буруу байна"),
  address: z.object({
    bagKhorooId: z
      .string()
      .min(2, "Байгууллагийн регистр хамгийн багадаа 2 тэмдэгтээс их байна"),
    details: z.string().min(2, "Дэлгэрэнгүй хаяг 2 тэмдэгтээс их байна"),
    coordinate: z.string().min(2, "2 тэмдэгтээс их байна"),
    phone_number: z.string().min(8, "Утасны дугаар 8 оронтой байх ёстой"),
  }),
  contract: z_contract,
  managerEmail: z.string().email("Имайл формат буруу байна"),
});

export const z_vendorUpdateSchema = z.object({
  name: z.string().min(2, "Нэр хамгийн багадаа 2 тэмдэгтээс их байна"),
  register: z
    .string()
    .min(2, "Байгууллагийн регистр хамгийн багадаа 2 тэмдэгтээс их байна"),
  phoneNumber: z.string().min(8, "Утасны дугаар 8 оронтой байх ёстой"),
  email: z.string().email("Имайл формат буруу байна"),
  address: z.object({
    id: z.string(),
    bagKhorooId: z
      .string()
      .min(2, "Байгууллагийн регистр хамгийн багадаа 2 тэмдэгтээс их байна"),
    details: z.string().min(2, "Дэлгэрэнгүй хаяг 2 тэмдэгтээс их байна"),
    coordinate: z.string().min(2, "2 тэмдэгтээс их байна"),
    phone_number: z.string().min(8, "Утасны дугаар 8 оронтой байх ёстой"),
  }),
  contract: z
    .object({
      id: z.string(),
    })
    .merge(z_contract),
  managerEmail: z.string().email("Имайл формат буруу байна"),
});

const vendorRoute = new Hono()
  .post("/create", zValidator("json", z_vendorCreateSchema), async (c) => {
    const {
      name,
      register,
      phoneNumber,
      email,
      address: addressData,
      contract: contractData,
    } = c.req.valid("json");

    const createdVendor = await db.transaction(async (tx) => {
      const newAddress = await tx
        .insert(address)
        .values({
          bagKhorooId: addressData.bagKhorooId,
          details: addressData.details,
          coordinate: addressData.coordinate,
          phoneNumber: addressData.phone_number,
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

      const newContract = await tx
        .insert(contract)
        .values({
          vendorId: newVendor[0].id,
          startDate: new Date(),
          expiresAt: new Date(),
          ...contractData,
        })
        .returning();

      const newPaymentPlan = await tx
        .insert(paymentPlan)
        .values({
          contractId: newContract[0].id,
          paymentType: contractData.paymentType,
        })
        .returning();

      await tx
        .insert(paymentDateEachMonth)
        .values({
          paymentPlanId: newPaymentPlan[0].id,
          period: new Date(),
          monthsAfter: contractData.monthsAfter,
          paymentDateType: contractData.paymentDateType!,
          sameDayEachMonth: contractData.sameDayEachMonth,
          weekOfMonth: contractData.weekOfMonth,
          dayOfWeek: contractData.dayOfWeek,
          daysAfter: contractData.daysAfter,
        })
        .returning();

      return newVendor[0];
    });

    return c.json(
      { vendor: createdVendor, message: "Vendor created successfully!" },
      200
    );
  })
  .post(
    "/create-contract",
    zValidator(
      "json",
      z.object({
        vendorId: z.string(),
        z_contract,
      })
    ),
    async (c) => {
      const { vendorId, z_contract } = c.req.valid("json");

      const createdContract = await createContract({
        vendorId,
        ...z_contract,
      });

      return c.json(
        {
          contract: createdContract,
          message: "Contract created successfully!",
        },
        200
      );
    }
  )
  .get("/list", async (c) => {
    const vendors = await db.query.vendor.findMany({
      with: {
        contract: true,
        address: true,
        cards: true,
      },
    });

    return c.json(
      {
        vendors,
        message: "Success",
      },
      200
    );
  })
  .get("/:id", async (c) => {
    const vendorId = c.req.param("id");

    try {
      const vendorById = await db.query.vendor.findFirst({
        where: eq(vendor.id, vendorId),
        with: {
          contract: true,
          address: true,
          cards: true,
        },
      });

      return c.json(
        {
          vendor: vendorById,
          message: "Success",
        },
        200
      );
    } catch (e) {
      return c.json({ message: "Vendor not found!", vendor: null }, 404);
    }
  })
  .post("/update/:id", zValidator("json", z_vendorUpdateSchema), async (c) => {
    const vendorId = c.req.param("id");
    const {
      name,
      register,
      phoneNumber,
      email,
      address: addressData,
      contract: contractData,
    } = c.req.valid("json");

    try {
      const updatedVendor = await db.transaction(async (tx) => {
        const updatedAddress = await tx
          .update(address)
          .set({
            bagKhorooId: addressData.bagKhorooId,
            details: addressData.details,
            coordinate: addressData.coordinate,
            phoneNumber: addressData.phone_number,
          })
          .where(eq(address.id, addressData.id))
          .returning();

        const updatedVendor = await tx
          .update(vendor)
          .set({
            name,
            register,
            phoneNumber,
            email,
            addressId: updatedAddress[0].id,
          })
          .where(eq(vendor.id, vendorId))
          .returning();

        await tx
          .update(contract)
          .set({
            ...contractData,
          })
          .where(eq(contract.id, contractData.id))
          .returning();

        return updatedVendor[0];
      });

      return c.json(
        { vendor: updatedVendor, message: "Vendor updated successfully!" },
        200
      );
    } catch (e) {
      return c.json({ message: "Vendor not found!", vendor: null }, 404);
    }
  })
  .post("/delete/:id", async (c) => {
    const vendorId = c.req.param("id");
    try {
      const deletedVendor = await db
        .delete(vendor)
        .where(eq(vendor.id, vendorId))
        .returning();

      return c.json(
        { vendor: deletedVendor[0], message: "Vendor deleted successfully!" },
        200
      );
    } catch (e) {
      return c.json({ message: "Vendor not found!", vendor: null }, 404);
    }
  });

export default vendorRoute;
