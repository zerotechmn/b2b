import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "./lib/api";
import { signInSchema } from "./lib/zod";
import { Role, Vendor } from "./app/api/database/types";

export const authConfig = {
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        const response = await api.authenticate.login.$post({
          json: { email, password },
        });

        if (response.status === 404) return null;

        const data = await response.json();

        return { ...data.user, accessToken: data.accessToken };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.vendor = user.vendor;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.accessToken = token.accessToken as string;
        session.user.role = token.role as Role;
        session.user.vendor = token.vendor as Vendor;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
