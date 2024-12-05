import { NextResponse } from "next/server";
import db from "@/libs/prisma";
export async function GET(req: Request) {
  const temas = await db.estampa.findMany({
    select: {
      tema: true,
    },
    distinct: ["tema"],
  });

  const temasUnicos = temas.map((t) => t.tema);
  return NextResponse.json(temasUnicos, { status: 200 });
}
