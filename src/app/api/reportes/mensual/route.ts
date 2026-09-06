import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";

import { generarReporteMensual } from "@/services/reports/generateMonthlyReport";

export async function POST(req: NextRequest) {
  let body: {
    movimientos?: Movimiento[];
    mes?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 },
    );
  }

  const { movimientos, mes: mesParam } = body;

  if (!Array.isArray(movimientos)) {
    return NextResponse.json(
      { message: "El campo 'movimientos' es requerido." },
      { status: 400 },
    );
  }

  const response = generarReporteMensual(movimientos, mesParam);

  if (!response) {
    return NextResponse.json(
      { message: "No hay meses disponibles en los datos." },
      { status: 404 },
    );
  }

  return NextResponse.json(response);
}
