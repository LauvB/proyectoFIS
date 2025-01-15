import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import * as fs from "fs/promises";
import * as path from "path";

const uploadDir = path.join(process.cwd(), "public/products");

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

    const modelo = formData.get("modelo")?.toString();
    const color = formData.get("color")?.toString();
    const talla = formData.get("talla")?.toString();
    const material = formData.get("material")?.toString();
    const precio = formData.get("precio")?.toString() || "0";
    const estampaId = formData.get("estampaId")?.toString() || "0";
    const clienteId = formData.get("clienteId")?.toString() || "0";
    const estado = formData.get("estado")?.toString() || "pendiente";
    const file = formData.get("imagen") as File;

    if (!modelo || !color || !talla || !material || !file) {
      return NextResponse.json(
        { message: "Campos incompletos" },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    const fileName = `${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer) as Uint8Array;
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/products/${fileName}`;

    // Crear la camiseta en la base de datos
    const nuevaCamiseta = await prisma.camiseta.create({
      data: {
        modelo,
        color,
        talla,
        material,
        precio: parseFloat(precio),
        estampaId: parseInt(estampaId, 10),
        clienteId: parseInt(clienteId, 10),
        estado,
        camisetaImagen: imageUrl,
      },
    });

    return NextResponse.json(nuevaCamiseta, { status: 201 });
  } catch (error: any) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: `Error al agregar la camiseta: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Obtén los parámetros de consulta (si existen)
    const { searchParams } = new URL(req.url);
    const clienteId = searchParams.get("clienteId");
    const modelo = searchParams.get("modelo");

    // Construye los filtros dinámicamente según los parámetros
    const filters: any = {};
    if (clienteId) {
      filters.clienteId = parseInt(clienteId, 10);
    }
    if (modelo) {
      filters.modelo = modelo;
    }

    // Recupera las camisetas desde la base de datos
    const camisetas = await prisma.camiseta.findMany({
      where: filters,
      include: {
        estampa: true, // Incluye información relacionada con la estampa si existe
      },
    });

    // Retorna las camisetas encontradas
    return NextResponse.json(camisetas, { status: 200 });
  } catch (error: any) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { message: `Error al obtener camisetas: ${error.message}` },
      { status: 500 }
    );
  }
}
