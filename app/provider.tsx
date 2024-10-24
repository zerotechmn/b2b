"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function Provider({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: Session | null }>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
