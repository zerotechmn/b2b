"use server";

import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/zod";
import { z } from "zod";

export async function login(credentials: z.infer<typeof signInSchema>) {
  try {
    await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
  } catch (error) {
    return { message: "Invalid credentials" };
  }
}

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    return;
  }
}
