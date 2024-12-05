import { NextResponse } from "next/server";
import db from "@/libs/prisma";
export async function GET(req: Request) {
  try {
    const artistas = await db.artista.findMany({
      where: {
        estampas: {
          some: {
            disponibleParaVenta: true,
          },
        },
      },
      include: {
        usuario: true,
      },
    });

    const artistasDetalles = artistas.map((artista) => ({
      id: artista.id,
      nombre: artista.usuario.nombre,
    }));

    return NextResponse.json(artistasDetalles, { status: 200 });
  } catch (error) {
    console.error("Error al obtener artistas:", error);
    return NextResponse.json(
      { message: "Error al obtener artistas" },
      { status: 500 }
    );
  }
}
