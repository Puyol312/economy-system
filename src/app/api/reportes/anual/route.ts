import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";
import {
  calcularBalancePorMes,
  obtenerTotalesPorMes,
  obtenerAcumulado,
  calcularSaldoAcumulado
} from "@/controllers/MultiMonthController";

/**
 * ReporteAnualResponse
 *
 * Estructura del JSON que devuelve este endpoint.
 */
export interface ReporteAnualResponse {
  balancePorMes:  Record<string, number>;
  saldoAcumulado: Record<string, number>;
  creditosPorMes: Record<string, number>;
  debitosPorMes:  Record<string, number>;
  totalCreditos:  number;
  totalDebitos:   number;
  balanceAnual:   number;
  mejorMes:       string;
}

/**
 * POST /api/reportes/anual
 *
 * Recibe los movimientos de una hoja en el body, aplica los
 * controladores y devuelve todos los cálculos necesarios para
 * renderizar la página `/anual`.
 *
 * Body: `{ movimientos: Movimiento[] }`
 *
 * Respuestas:
 * - `200` → `ReporteAnualResponse`
 * - `400` → `{ message: string }` si falta el body o los movimientos.
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

  // ── Cálculos ──────────────────────────────────────────────────
  const balancePorMes  = calcularBalancePorMes(movimientos);
  const saldoAcumulado = calcularSaldoAcumulado(movimientos);
  const creditosPorMes = obtenerTotalesPorMes(movimientos, "credito");
  const debitosPorMes  = obtenerTotalesPorMes(movimientos, "debito");

  const totalCreditos  = obtenerAcumulado(creditosPorMes);
  const totalDebitos   = obtenerAcumulado(debitosPorMes);
  const balanceAnual   = obtenerAcumulado(balancePorMes);

  const mejorMes = Object.entries(balancePorMes)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "";

  const response: ReporteAnualResponse = {
    balancePorMes,
    saldoAcumulado,
    creditosPorMes,
    debitosPorMes,
    totalCreditos,
    totalDebitos,
    balanceAnual,
    mejorMes,
  };

  return NextResponse.json(response);
}