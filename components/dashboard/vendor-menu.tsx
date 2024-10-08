"use client";

import { IconCards, IconGasStation } from "@tabler/icons-react";
import { Building2, LineChart, User2, Wallet, WalletCards } from "lucide-react";
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
    href: "/drivers",
    title: "Жолооч",
    Icon: User2,
  },
  {
    href: "/cards",
    title: "Карт",
    Icon: IconCards,
  },
  {
    href: "/fff",
    title: "Карт захиалга",
    Icon: WalletCards,
  },
  {
    href: "/ff",
    title: "Карт цэнэглэлт",
    Icon: Wallet,
  },
  {
    href: "/sss",
    title: "Санхүү",
    Icon: LineChart,
  },
  {
    href: "/re",
    title: "ШТС-ын мэдээлэл",
    Icon: IconGasStation,
  },
];

export default function VendorMenu() {
  return (
    <>
      {vendorMenus.map((menu, index) => {
        return <MenuItem key={index} {...menu} />;
      })}
    </>
  );
}
