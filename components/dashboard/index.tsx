import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, CircleUser, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AdminMenu from "./admin-menu";
import BottomMenu from "./bottom-menu";
import { SheetMenu, SheetMenuBottom } from "./sheet-menu";
import VendorMenu from "./vendor-menu";

interface Props {
  children: React.ReactNode;
}

export async function Dashboard({ children }: Props) {
  const { user } = (await auth()) || {};

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block md:overflow-hidden flex-none h-screen sticky top-0">
        <div className="flex h-full max-h-screen flex-col gap-2 ">
          <div className="flex h-14 items-center border-b px-0 lg:h-[60px] lg:px-6">
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
            <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
              {user?.role?.platform === "ADMIN" ? (
                <AdminMenu />
              ) : (
                <VendorMenu />
              )}
            </nav>
          </div>

          <Separator />
          <BottomMenu />
        </div>
      </div>
      <div className="flex flex-col overflow-x-scroll">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
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

                <SheetMenu />
              </nav>

              <Separator />

              <nav className="grid gap-2 text-lg font-medium">
                <SheetMenuBottom />

                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-destructive hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Гарах
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {user?.role?.platform === "ADMIN" ? (
            <div>admin</div>
          ) : (
            <div className="w-full flex flex-1 gap-4 items-center">
              <h1 className="text-base lg:text-xl font-semibold mr-auto">
                Байгууллагын Мэдээлэл
              </h1>

              <div className="hidden lg:flex flex-col">
                <span className="text-xs text-muted-foreground">
                  РЕГИСТРИЙН ДУГААР
                </span>
                <span className="text-sm font-medium">
                  {user?.vendor?.register}
                </span>
              </div>

              <div className="hidden md:flex flex-col">
                <span className="text-xs text-muted-foreground">
                  БАЙГУУЛЛАГЫН НЭР
                </span>
                <span className="text-sm font-medium">
                  {user?.vendor?.name}
                </span>
              </div>
            </div>
          )}
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
        <main className="flex flex-1 flex-col gap-4  lg:gap-6  overflow-x-auto overflow-y-auto md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
