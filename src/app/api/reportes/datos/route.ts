import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";
import { agruparMovimientosPorMes } from "@/controllers/MultiMonthController";

/**
 * ReporteDatosResponse
 *
 * Estructura del JSON que devuelve este endpoint.
 * La página `/datos` lo consume para renderizar las cards
 * de movimientos agrupadas por mes.
 */
export interface ReporteDatosResponse {
  /**
   * Meses disponibles ordenados cronológicamente.
   * @example ["2026-01", "2026-02", "2026-03"]
   */
  meses: string[];

  /**
   * Movimientos agrupados por mes, ordenados cronológicamente
   * dentro de cada mes.
   * La clave es el mes en formato "YYYY-MM".
   */
  movimientosPorMes: Record<string, Movimiento[]>;
}

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

  // ── Agrupar y ordenar ─────────────────────────────────────────
  const agrupados = agruparMovimientosPorMes(movimientos);
  const meses     = Object.keys(agrupados).sort();

  // Ordenar movimientos dentro de cada mes cronológicamente
  const movimientosPorMes: Record<string, Movimiento[]> = {};

  for (const mes of meses) {
    movimientosPorMes[mes] = agrupados[mes].sort((a, b) =>
      a.dia.localeCompare(b.dia)
    );
  }

  const response: ReporteDatosResponse = {
    meses,
    movimientosPorMes,
  };

  return NextResponse.json(response);
}