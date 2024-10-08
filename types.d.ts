import { type DefaultSession } from "next-auth";
import { Role, Vendor } from "./app/api/database/types";

interface ExtendedUser {
  accessToken: string;
  role?: Role;
  vendor?: Vendor;
}

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends ExtendedUser {}
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends ExtendedUser {
    id?: string;
  }
}
