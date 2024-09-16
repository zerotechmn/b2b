"use server";

import { signIn } from "@/auth";
import { api } from "@/lib/api";
import { signInSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function login(credentials: z.infer<typeof signInSchema>) {
  return await signIn("credentials", { ...credentials, redirect: false })
    .then()
    .catch(() => {
      return { error: "Invalid user or password!" };
    });
}

// export async function logout(): Promise<ActionResult> {
//   "use server";
//   const { session } = await validateRequest();
//   if (!session) return { error: "Unauthorized" };

//   await lucia.invalidateSession(session.id);
//   const sessionCookie = lucia.createBlankSessionCookie();
//   cookies().set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );

//   return redirect("/login");
// }

// export async function resetPassword({
//   email,
// }: {
//   email: string;
// }): Promise<any> {
//   const response = await api.auth["reset-password"].$post({ json: { email } });
//   if (response.status !== 200) return { error: (await response.json()).error };

//   return redirect((await response.json()).link);
// }
