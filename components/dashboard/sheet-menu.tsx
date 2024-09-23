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
    href: "/",
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
export function SheetMenu() {
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
              "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
              pathname === menu.href && "bg-muted text-foreground"
            )}
          >
            <LinkIcon className="h-5 w-5" />
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

export function SheetMenuBottom() {
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
              "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
              pathname === menu.href && "bg-muted text-foreground"
            )}
          >
            <LinkIcon className="h-5 w-5" />
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
