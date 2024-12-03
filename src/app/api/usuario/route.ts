import { NextRequest, NextResponse } from "next/server";
import db from "@/libs/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, name, password, newPassword } = data;

    // Verifica si el usuario existe
    const user = await db.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Validar y actualizar la contraseña si se proporciona
    let hashedNewPassword = user.contrasena; // Mantener la contraseña actual por defecto
    if (password && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(password, user.contrasena);
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: "Contraseña actual incorrecta" },
          { status: 403 }
        );
      }
      hashedNewPassword = await bcrypt.hash(newPassword, 10);
    }

    // Actualizar solo los campos proporcionados
    const updatedUser = await db.usuario.update({
      where: { email: user.email },
      data: {
        nombre: name || user.nombre,
        contrasena: hashedNewPassword,
      },
    });

    return NextResponse.json({
      message: "Perfil actualizado correctamente",
      user: {
        id: updatedUser.id,
        name: updatedUser.nombre,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
