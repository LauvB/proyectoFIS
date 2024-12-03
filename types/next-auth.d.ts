import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Agrega el campo `role` al tipo `User`
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      artistaId?: number | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    artistaId?: number | null;
  }
}

// Agrega el campo `role` al tipo `JWT`
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    artistaId?: number | null;
  }
}
