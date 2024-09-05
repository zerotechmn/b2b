import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isWithinExpirationDate(expirationDate: Date): boolean {
  return new Date() <= expirationDate;
}
