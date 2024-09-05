import {
  Bell,
  Building2,
  CircleUser,
  Contact2,
  HelpCircle,
  LineChart,
  LogOut,
  Wallet,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCards, IconGasStation } from "@tabler/icons-react";
import Image from "next/image";
import { MenuItem } from "./menu-item";

interface Props {
  children: React.ReactNode;
}

const menus = [
  {
    href: "/",
    title: "Байгууллага",
    Icon: Building2,
  },
  {
    href: "/",
    title: "Картууд",
    Icon: IconCards,
  },
  {
    href: "/",
    title: "Карт цэнэглэлт",
    Icon: Wallet,
  },
  {
    href: "/",
    title: "Карт захиалга",
    Icon: WalletCards,
  },
  {
    href: "/",
    title: "Тайлан",
    Icon: LineChart,
  },
  {
    href: "/",
    title: "ШТС-ын мэдээлэл",
    Icon: IconGasStation,
  },
];

export function Dashboard({ children }: Props) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/logo-2.png"
                className="w-[56px] lg:w-[81px]"
                width="81"
                height="29"
                alt="logo"
              />
              <span className="text-secondary">Шунхлай</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menus.map((menu) => (
                <MenuItem
                  key={menu.href}
                  href={menu.href}
                  title={menu.title}
                  Icon={menu.Icon}
                />
              ))}
            </nav>
          </div>

          {/* <Separator /> */}

          <div className="p-4 text-sm font-medium">
            <MenuItem href="/" title="Тусламж" Icon={HelpCircle} />
            <MenuItem href="/" title="Холбоо барих" Icon={Contact2} />

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:text-destructive/80"
            >
              <LogOut className="h-4 w-4" />
              Гарах
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium mb-auto">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Image
                    src="/logo-2.png"
                    className="w-[56px] lg:w-[81px]"
                    width="81"
                    height="29"
                    alt="logo"
                  />
                  <span className="text-secondary">Шунхлай</span>
                </Link>

                {menus.map((menu) => (
                  <SheetMenu
                    key={menu.href}
                    href={menu.href}
                    title={menu.title}
                    Icon={menu.Icon}
                  />
                ))}
              </nav>

              <Separator />

              <nav className="grid gap-2 text-lg font-medium">
                <SheetMenu href="/" title="Тусламж" Icon={HelpCircle} />
                <SheetMenu href="/" title="Холбоо барих" Icon={Contact2} />

                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-destructive hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Гарах
                </Link>
              </nav>
            </SheetContent>
          </Sheet> */}
          <div className="w-full flex flex-1 gap-4 items-center">
            <h1 className="text-base lg:text-xl font-semibold mr-auto">
              Байгууллагын Мэдээлэл
            </h1>

            <div className="hidden lg:flex flex-col">
              <span className="text-xs text-muted-foreground">
                РЕГИСТРИЙН ДУГААР
              </span>
              <span className="text-sm font-medium">1849201</span>
            </div>

            <div className="hidden md:flex flex-col">
              <span className="text-xs text-muted-foreground">
                БАЙГУУЛЛАГЫН НЭР
              </span>
              <span className="text-sm font-medium">
                Прокрафт Дизайн Агентлаг
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
