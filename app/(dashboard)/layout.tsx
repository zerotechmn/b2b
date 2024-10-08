import { Dashboard } from "@/components/dashboard";

export const experimental_ppr = true;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Dashboard>{children}</Dashboard>;
}
