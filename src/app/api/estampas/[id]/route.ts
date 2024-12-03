import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const estampa = await prisma.estampa.findUnique({
      where: { id },
      include: { imagenes: true },
    });

    if (!estampa) {
      return NextResponse.json(
        { message: "La estampa no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json(estampa, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la estampa:", error);
    return NextResponse.json(
      { message: "Error al obtener la estampa" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const { nombre, descripcion, tema, disponible } = await req.json();

    const updatedEstampa = await prisma.estampa.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(tema && { tema }),
        ...(disponible !== undefined && { disponibleParaVenta: disponible }),
      },
    });

    return NextResponse.json(updatedEstampa, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la estampa:", error);
    return NextResponse.json(
      { message: "Error al actualizar la estampa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "El ID de la estampa debe ser un número válido" },
        { status: 400 }
      );
    }

    const existingEstampa = await prisma.estampa.findUnique({
      where: { id },
      include: { imagenes: true },
    });

    if (!existingEstampa) {
      return NextResponse.json(
        { message: "La estampa no existe" },
        { status: 404 }
      );
    }

    // Eliminar los archivos físicos asociados
    for (const imagen of existingEstampa.imagenes) {
      const filePath = path.join(process.cwd(), "public", imagen.url);
      try {
        await fs.unlink(filePath); // Eliminar archivo físico
      } catch (err) {
        console.warn(`No se pudo eliminar el archivo: ${filePath}`, err);
      }
    }

    // Eliminar las imágenes asociadas en la base de datos
    await prisma.imagen.deleteMany({
      where: { estampaId: id },
    });

    // Eliminar la estampa
    await prisma.estampa.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Estampa e imágenes asociadas eliminadas exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la estampa:", error);
    return NextResponse.json(
      { message: "Error al eliminar la estampa" },
      { status: 500 }
    );
  }
}
