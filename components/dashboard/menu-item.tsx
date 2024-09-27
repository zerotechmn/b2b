"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  Contact2,
  HelpCircle,
  LineChart,
  Wallet,
  WalletCards,
} from "lucide-react";
import { IconCards, IconGasStation } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  Icon: any;
  href: string;
  selected?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
}

const menus = [
  {
    href: "/vendor",
    title: "Байгууллага",
    Icon: Building2,
  },
  {
    href: "/carts",
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

export default function MenuItem() {
  const pathname = usePathname();
  return (
    <>
      {menus.map((menu, index) => {
        const LinkIcon = menu.Icon;
        return (
          <Link
            key={index}
            href={menu.href}
            className={cn(
              "flex items-center gap-4 pl-10 py-4  text-muted-foreground transition-all hover:text-white hover:bg-primary text-base",
              pathname === menu.href && "text-black bg-surface-surface3"
            )}
          >
            <LinkIcon className="h-4 w-4" />
            {menu.title}
            {/* {showBadge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {badgeCount}
                  </Badge>
                )} */}
          </Link>
        );
      })}
    </>
  );
}

const bottomMenu = [
  {
    href: "/tes23",
    title: "Тусламж",
    Icon: HelpCircle,
  },
  {
    href: "/test",
    title: "Картууд",
    Icon: Contact2,
  },
];

export function MenuItemBottom() {
  const pathname = usePathname();
  return (
    <>
      {bottomMenu.map((menu, index) => {
        const LinkIcon = menu.Icon;
        return (
          <Link
            key={index}
            href={menu.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-white hover:bg-primary",
              pathname === menu.href && "text-white bg-surface-1"
            )}
          >
            <LinkIcon className="h-4 w-4" />
            {menu.title}
            {/* {showBadge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {badgeCount}
                  </Badge>
                )} */}
          </Link>
        );
      })}
    </>
  );
}
