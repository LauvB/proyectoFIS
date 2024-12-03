import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import db from "@/libs/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userFound = await db.usuario.findUnique({
          where: {
            email: credentials?.email,
          },
          include: {
            // Incluir relaciones para obtener el artista si es necesario
            artista: true,
          },
        });

        if (!userFound) throw new Error("Usuario no encontrado");

        const matchPassword = await bcrypt.compare(
          credentials?.password ?? "",
          userFound.contrasena
        );

        if (!matchPassword) throw new Error("Contraseña incorrecta");

        return {
          id: userFound.id.toString(),
          name: userFound.nombre,
          email: userFound.email,
          role: userFound.rol,
          artistaId: userFound.artista?.id || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { role?: string; artistaId?: number | null };
    }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.artistaId = token.artistaId ?? null;
      }
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT & { role?: string; artistaId?: number | null };
      user?: { role?: string; artistaId?: number | null };
    }) {
      if (user) {
        token.role = user.role;
        token.artistaId = user.artistaId ?? null; // Añade el artistaId al token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
