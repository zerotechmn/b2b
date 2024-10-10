import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { address, vendor, wallet } from "../../database/schema";
import createContract, { z_contract } from "./create-contract";
import { eq } from "drizzle-orm";

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

      await tx
        .insert(wallet)
        .values({
          balance: 0,
          vendorId: newVendor[0].id,
        })
        .returning();

      await createContract({ vendorId: newVendor[0].id, ...contractData });

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
        wallet: true,
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
    const vendorById = await db.query.vendor.findFirst({
      where: eq(vendor.id, vendorId),
      with: {
        contract: true,
        address: true,
        wallet: true,
        cards: true,
      },
    });

    if (!vendorById) {
      return c.json({ message: "Vendor not found", vendor: null }, 404);
    }

    return c.json(
      {
        vendor: vendorById,
        message: "Success",
      },
      200
    );
  });

export default vendorRoute;
