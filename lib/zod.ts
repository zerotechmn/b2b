import { object, string } from "zod";

export const signInSchema = object({
  email: string(),
  password: string(),
});

export const changePasswordSchema = object({
  newPassword: string().min(8),
  repeatPassword: string().min(8),
});
