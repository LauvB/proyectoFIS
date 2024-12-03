import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Asegúrate de que la carpeta de carga existe
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nombre = formData.get("nombre")?.toString();
    const descripcion = formData.get("descripcion")?.toString();
    const tema = formData.get("tema")?.toString();
    const artistaId = formData.get("artistaId")?.toString();
    const disponible = formData.get("disponible") === "true";

    const file = formData.get("imagen") as File;

    if (!nombre || !descripcion || !tema || !artistaId || !file) {
      return NextResponse.json(
        { message: "Campos incompletos" },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    // Guardar la imagen en el servidor
    const filePath = path.join(uploadDir, file.name);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const imageUrl = `/uploads/${file.name}`;

    // Guardar la estampa en la base de datos
    const newEstampa = await prisma.estampa.create({
      data: {
        nombre,
        descripcion,
        tema,
        artistaId: parseInt(artistaId, 10),
        popularidad: 0,
        rating: 0,
        disponibleParaVenta: disponible,
        imagenes: {
          create: { url: imageUrl },
        },
      },
    });

    return NextResponse.json(newEstampa, { status: 201 });
  } catch (error: any) {
    console.error("Error al subir la estampa:", error.message);
    return NextResponse.json(
      { message: "Error al crear la estampa" },
      { status: 500 }
    );
  }
}

// Obtener todas las estampas
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const artistaId = url.searchParams.get("artistaId");

    if (!artistaId) {
      return NextResponse.json(
        { message: "El ID del artista es requerido" },
        { status: 400 }
      );
    }

    // Buscar estampas solo del artista especificado
    const estampas = await prisma.estampa.findMany({
      where: {
        artistaId: parseInt(artistaId, 10),
      },
      include: {
        imagenes: true,
      },
    });

    // Mapear la disponibilidad y las imágenes
    const estampasDetalles = estampas.map((estampa) => ({
      ...estampa,
      disponible: estampa.disponibleParaVenta,
      imagen: estampa.imagenes?.[0]?.url,
    }));

    return NextResponse.json(estampasDetalles, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estampas:", error);
    return NextResponse.json(
      { message: "Error al obtener estampas" },
      { status: 500 }
    );
  }
}
