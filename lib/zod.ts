import { z_vendorCreateSchema } from "@/app/api/[[...route]]/vendor-route";
import { number, object, string } from "zod";
import { z } from "zod";

export const signInSchema = object({
  email: string(),
  password: string(),
});

export type VendorCreateSchema = z.infer<typeof z_vendorCreateSchema>;
export const changePasswordSchema = object({
  newPassword: string().min(8),
  repeatPassword: string().min(8),
});
