import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isWithinExpirationDate(expirationDate: Date): boolean {
  return new Date() <= expirationDate;
}

export function currencyFormat(num: number) {
  const formated =
    num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "₮";

  return formated;
}

export function truncateFormat(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}
