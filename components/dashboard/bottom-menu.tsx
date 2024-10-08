"use client";

import { Contact2, HelpCircle, LogOut } from "lucide-react";
import MenuItem from "./menu-item";
import { logout } from "@/app/auth/actions";

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

export default function BottomMenu() {
  return (
    <div className="grid p-4 gap-1 text-sm font-medium">
      {bottomMenu.map((menu, index) => {
        return <MenuItem key={index} {...menu} />;
      })}

      <form action={logout}>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:text-destructive/80">
          <LogOut className="h-4 w-4" />
          Гарах
        </button>
      </form>
    </div>
  );
}
