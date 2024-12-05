import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

/**export async function POST(req: Request) {
  try {
    const {
      modelo,
      color,
      talla,
      material,
      precio,
      estampaId,
      clienteId,
      posicionEstampaX,
      posicionEstampaY,
    } = await req.json();

    if (
      !modelo ||
      !color ||
      !talla ||
      !material ||
      !precio ||
      !estampaId ||
      !posicionEstampa
    ) {
      return NextResponse.json(
        { message: "Todos los campos requeridos deben completarse" },
        { status: 400 }
      );
    }
    
    const newCamiseta = await prisma.camiseta.create({
      data: {
        modelo,
        color,
        talla,
        material,
        precio: parseFloat(precio),
        estampaId: parseInt(estampaId, 10),
        clienteId: clienteId ? parseInt(clienteId, 10) : null,
        posicionEstampaX: posicionEstampaX,
        posicionEstampaY: posicionEstampaY,
      },
    });

    return NextResponse.json(newCamiseta, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear la camiseta:", error.message);
    return NextResponse.json(
      { message: "Error al crear la camiseta" },
      { status: 500 }
    );
  }
}**/

export async function POST(req: Request) {
  try {
    const {
      modelo,
      color,
      talla,
      material,
      precio,
      estampaId,
      clienteId,
      posicionEstampaX,
      posicionEstampaY,
    } = await req.json();

    if (
      !modelo ||
      !color ||
      !talla ||
      !material ||
      !precio ||
      !estampaId ||
      !posicionEstampaX ||
      !posicionEstampaY
    ) {
      return NextResponse.json(
        { message: "Todos los campos requeridos deben completarse" },
        { status: 400 }
      );
    }

    const newCamiseta = await prisma.camiseta.create({
      data: {
        modelo,
        color,
        talla,
        material,
        precio: parseFloat(precio),
        estampaId: parseInt(estampaId, 10),
        clienteId: clienteId ? parseInt(clienteId, 10) : null,
        posicionEstampaX: posicionEstampaX || null, // Asegúrate de manejar valores null
        posicionEstampaY: posicionEstampaY || null,
      },
    });

    return NextResponse.json(newCamiseta, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear la camiseta:", error.message);
    return NextResponse.json(
      { message: "Error al crear la camiseta" },
      { status: 500 }
    );
  }
}
