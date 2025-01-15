import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import * as fs from "fs/promises";
import * as path from "path";

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
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer) as Uint8Array;
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

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

// Obtener las estampas
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const artistaId = url.searchParams.get("artistaId");
    const tema = url.searchParams.get("tema");
    const rol = url.searchParams.get("rol");
    const busqueda = url.searchParams.get("busqueda");
    const mejorValorada = url.searchParams.get("mejorValorada") === "true";

    let estampas;

    if (busqueda) {
      // Búsqueda general por nombre, tema o artista
      estampas = await prisma.estampa.findMany({
        where: {
          OR: [
            { nombre: { contains: busqueda } },
            { tema: { contains: busqueda } },
            {
              artista: {
                usuario: {
                  nombre: { contains: busqueda },
                },
              },
            },
          ],
          disponibleParaVenta: true,
        },
        include: {
          imagenes: true,
          artista: {
            include: {
              usuario: true,
            },
          },
        },
      });
    } else if (artistaId) {
      // Filtrar por artista específico
      if (rol === "ARTISTA") {
        estampas = await prisma.estampa.findMany({
          where: {
            artistaId: parseInt(artistaId, 10),
          },
          include: {
            imagenes: true,
            artista: {
              include: {
                usuario: true,
              },
            },
          },
        });
      } else {
        estampas = await prisma.estampa.findMany({
          where: {
            artistaId: parseInt(artistaId, 10),
            disponibleParaVenta: true,
          },
          include: {
            imagenes: true,
            artista: {
              include: {
                usuario: true,
              },
            },
          },
        });
      }
    } else if (tema) {
      estampas = await prisma.estampa.findMany({
        where: {
          tema: tema,
          disponibleParaVenta: true,
        },
        include: {
          imagenes: true,
          artista: {
            include: {
              usuario: true,
            },
          },
        },
      });
    } else if (mejorValorada) {
      // Filtrar por estampas con rating mayor a 4
      estampas = await prisma.estampa.findMany({
        where: {
          rating: {
            gte: 4,
          },
          disponibleParaVenta: true,
        },
        include: {
          imagenes: true,
          artista: {
            include: {
              usuario: true,
            },
          },
        },
      });
    } else {
      estampas = await prisma.estampa.findMany({
        where: {
          disponibleParaVenta: true,
        },
        include: {
          imagenes: true,
          artista: {
            include: {
              usuario: true,
            },
          },
        },
      });
    }

    // Mapear la disponibilidad y las imágenes
    const estampasDetalles = estampas.map((estampa) => ({
      ...estampa,
      disponible: estampa.disponibleParaVenta,
      imagen: estampa.imagenes?.[0]?.url,
      artistaNombre: estampa.artista?.usuario.nombre,
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
