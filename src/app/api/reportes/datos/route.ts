import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";
import { generarReporteDatos } from "@/services/reports/generateDataReport";


/**
 * POST /api/reportes/datos
 *
 * Recibe los movimientos de una hoja en el body, los agrupa
 * por mes y los devuelve ordenados cronológicamente para
 * renderizar la página `/datos`.
 *
 * Body: `{ movimientos: Movimiento[] }`
 *
 * Respuestas:
 * - `200` → `ReporteDatosResponse`
 * - `400` → `{ message: string }` si falta el body o los movimientos.
 * - `404` → `{ message: string }` si no hay movimientos.
 *
 * @example
 * const res = await fetch("/api/reportes/datos", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ movimientos }),
 * });
 * const { meses, movimientosPorMes } = await res.json();
 */
export async function POST(req: NextRequest) {
  let body: { movimientos?: Movimiento[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 }
    );
  }

  const { movimientos } = body;

  if (!movimientos || !Array.isArray(movimientos)) {
    return NextResponse.json(
      { message: "El campo 'movimientos' es requerido." },
      { status: 400 }
    );
  }

  if (movimientos.length === 0) {
    return NextResponse.json(
      { message: "No hay movimientos disponibles." },
      { status: 404 }
    );
  }

  const response = generarReporteDatos(movimientos);

  return NextResponse.json(response);
}