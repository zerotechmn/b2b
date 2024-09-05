"use server";

import { lucia, validateRequest } from "@/auth";
import { api } from "@/lib/api";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<any> {
  const response = await api.auth.login.$post({ json: { email, password } });
  if (response.status === 403) return { error: (await response.json()).error };

  const session = await lucia.createSession(
    (
      await response.json()
    ).user.id,
    {}
  );
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) return { error: "Unauthorized" };

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/login");
}

export async function resetPassword({
  email,
}: {
  email: string;
}): Promise<any> {
  const response = await api.auth["reset-password"].$post({ json: { email } });
  if (response.status !== 200) {
    console.log("gay", response);
    return { error: (await response.json()).error };
  }

  return redirect((await response.json()).link);
}
