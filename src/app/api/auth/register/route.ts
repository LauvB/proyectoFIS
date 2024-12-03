import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/libs/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const userFound = await db.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userFound) {
      return NextResponse.json(
        {
          message: "El email ya existe",
        },
        {
          status: 400,
        }
      );
    }

    const usernameFound = await db.usuario.findFirst({
      where: {
        nombre: data.nombre,
      },
    });

    if (usernameFound) {
      return NextResponse.json(
        {
          message: "El usuario ya existe",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(data.contrasena, 10);

    const newUser = await db.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        contrasena: hashedPassword,
        rol: data.rol,
        ...(data.rol === "ARTISTA"
          ? { artista: { create: {} } }
          : { cliente: { create: {} } }),
      },
    });

    const { contrasena: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
