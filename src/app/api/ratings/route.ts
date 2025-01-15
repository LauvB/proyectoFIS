import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// Al calificar la estampa el promedio se actualiza en rating de Estampa
export async function POST(req: Request) {
  try {
    const { estampaId, puntaje, clienteId } = await req.json();

    if (!estampaId || !clienteId || typeof puntaje !== "number") {
      return NextResponse.json(
        { message: "Datos inválidos o incompletos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya ha calificado la estampa
    const existingRating = await prisma.rating.findFirst({
      where: { estampaId, clienteId },
    });

    let newAverage = 0;
    let newTotal = 0;

    if (existingRating) {
      // Si ya calificó
      return NextResponse.json(
        { message: "El usuario ya calificó la estampa" },
        { status: 400 }
      );
    } else {
      // Si no calificó, crear nueva
      await prisma.rating.create({
        data: { estampaId, clienteId, puntaje },
      });

      // Recalcular promedio
      const estampa = await prisma.estampa.findUnique({
        where: { id: estampaId },
        select: { rating: true, totalRatings: true },
      });

      newTotal = (estampa?.totalRatings ?? 0) + 1;
      newAverage =
        ((estampa?.rating ?? 0) * (estampa?.totalRatings ?? 0) + puntaje) /
        newTotal;
    }

    // Actualizar promedio en el modelo Estampa
    await prisma.estampa.update({
      where: { id: estampaId },
      data: { rating: newAverage, totalRatings: newTotal },
    });

    return NextResponse.json(
      { averageRating: newAverage, totalRatings: newTotal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al calificar la estampa:", error);
    return NextResponse.json(
      { message: "Error al calificar la estampa" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const estampaId = parseInt(searchParams.get("stampId") || "", 10);
    const clienteId = parseInt(searchParams.get("clienteId") || "", 10);

    if (isNaN(estampaId) || isNaN(clienteId)) {
      return NextResponse.json(
        { message: "Datos inválidos para la consulta" },
        { status: 400 }
      );
    }

    // Obtener el promedio y total de calificaciones
    const estampa = await prisma.estampa.findUnique({
      where: { id: estampaId },
      select: {
        rating: true,
        totalRatings: true,
      },
    });

    if (!estampa) {
      return NextResponse.json(
        { message: "Estampa no encontrada." },
        { status: 404 }
      );
    }

    // Si usuarioId está presente, buscar también la calificación del usuario
    let userRating = null;
    let hasRated = false;
    if (clienteId) {
      const userRatingRecord = await prisma.rating.findFirst({
        where: {
          estampaId,
          clienteId,
        },
        select: {
          puntaje: true,
        },
      });

      if (userRatingRecord) {
        userRating = userRatingRecord.puntaje;
        hasRated = true;
      }
    }

    return NextResponse.json({
      averageRating: estampa.rating,
      totalRatings: estampa.totalRatings,
      userRating, // Será null si no hay usuarioId o no hay calificación del usuario
      hasRated,
    });
  } catch (error) {
    console.error("Error al obtener el rating de la estampa:", error);
    return NextResponse.json(
      { message: "Error al obtener el rating de la estampa." },
      { status: 500 }
    );
  }
}
