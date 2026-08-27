import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";
import { generarReporteAnual } from "@/services/reports/generateAnnualReport";

export async function POST(req: NextRequest) {
  let body: {
    movimientos?: Movimiento[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 },
    );
  }

  const { movimientos } = body;

  if (!Array.isArray(movimientos)) {
    return NextResponse.json(
      { message: "El campo 'movimientos' es requerido." },
      { status: 400 },
    );
  }

  const response = generarReporteAnual(movimientos);

  return NextResponse.json(response);
}