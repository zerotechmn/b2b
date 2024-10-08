"use client";

import { IconCards, IconGasStation } from "@tabler/icons-react";
import { Building2, LineChart, Wallet, WalletCards } from "lucide-react";
import MenuItem from "./menu-item";

interface Props {
  title: string;
  Icon: any;
  href: string;
  selected?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
}

const vendorMenus = [
  {
    href: "/",
    title: "Байгууллага",
    Icon: Building2,
  },
  {
    href: "/cards",
    title: "Картууд",
    Icon: IconCards,
  },
  {
    href: "/ff",
    title: "Карт цэнэглэлт",
    Icon: Wallet,
  },
  {
    href: "/fff",
    title: "Карт захиалга",
    Icon: WalletCards,
  },
  {
    href: "/sss",
    title: "Тайлан",
    Icon: LineChart,
  },
  {
    href: "/re",
    title: "ШТС-ын мэдээлэл",
    Icon: IconGasStation,
  },
];

export default function AdminMenu() {
  return (
    <>
      {vendorMenus.map((menu, index) => {
        return <MenuItem key={index} {...menu} />;
      })}
    </>
  );
}
