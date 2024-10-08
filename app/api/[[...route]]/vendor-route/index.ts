import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../database/client";
import { address, vendor, wallet } from "../../database/schema";
import createContract, { z_contract } from "./create-contract";

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
        contract: z_contract,
        managerEmail: z.string(),
      })
    ),
    async (c) => {
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
    }
  )
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
  );

export default vendorRoute;
