import { NextRequest, NextResponse } from "next/server";
import type { Movimiento } from "@/types";
import {
  calcularBalance,
  calcularBalancePorDia,
  obtenerTotalesPorDia,
  sumarTotales,
} from "@/controllers/SingleMonthController";
import { agruparMovimientosPorMes } from "@/controllers/MultiMonthController";
import { agruparPorConcepto } from "@/controllers/SingleMonthController";

/**
 * ReporteMensualResponse
 *
 * Estructura del JSON que devuelve este endpoint.
 */
export interface ReporteMensualResponse {
  meses:          string[];
  mes:            string;
  balancePorDia:  Record<string, number>;
  creditosPorDia: Record<string, number>;
  debitosPorDia:  Record<string, number>;
  totalCreditos:  number;
  totalDebitos:   number;
  balanceMes:     number;
  creditos:       [string, number][];
  debitos:        [string, number][];
}

/**
 * POST /api/reportes/mensual
 *
 * Recibe los movimientos de una hoja y el mes a analizar en el body,
 * aplica los controladores y devuelve todos los cálculos necesarios
 * para renderizar la página `/mensual`.
 *
 * Si `mes` no se provee o no existe, usa el primer mes disponible.
 *
 * Body: `{ movimientos: Movimiento[], mes?: string }`
 *
 * Respuestas:
 * - `200` → `ReporteMensualResponse`
 * - `400` → `{ message: string }` si falta el body o los movimientos.
 * - `404` → `{ message: string }` si no hay meses disponibles.
 *
 * @example
 * const res = await fetch("/api/reportes/mensual", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ movimientos, mes: "2026-04" }),
 * });
 * const reporte = await res.json();
 */
export async function POST(req: NextRequest) {
  let body: { movimientos?: Movimiento[]; mes?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 }
    );
  }

  const { movimientos, mes: mesParam } = body;

  if (!movimientos || !Array.isArray(movimientos)) {
    return NextResponse.json(
      { message: "El campo 'movimientos' es requerido." },
      { status: 400 }
    );
  }

  // ── Meses disponibles ─────────────────────────────────────────
  const movimientosPorMes = agruparMovimientosPorMes(movimientos);
  const meses             = Object.keys(movimientosPorMes).sort();

  if (meses.length === 0) {
    return NextResponse.json(
      { message: "No hay meses disponibles en los datos." },
      { status: 404 }
    );
  }

  const mes = mesParam && movimientosPorMes[mesParam] ? mesParam : meses[0];

  // ── Cálculos del mes ──────────────────────────────────────────
  const movimientosMes = movimientosPorMes[mes] ?? [];

  const balancePorDia  = calcularBalancePorDia(movimientosMes);
  const creditosPorDia = obtenerTotalesPorDia(movimientosMes, "credito");
  const debitosPorDia  = obtenerTotalesPorDia(movimientosMes, "debito");

  const totalCreditos  = sumarTotales(creditosPorDia);
  const totalDebitos   = sumarTotales(debitosPorDia);
  const balanceMes     = calcularBalance(movimientosMes);

  const creditos       = agruparPorConcepto(movimientosMes, "credito");
  const debitos        = agruparPorConcepto(movimientosMes, "debito");

  const response: ReporteMensualResponse = {
    meses,
    mes,
    balancePorDia,
    creditosPorDia,
    debitosPorDia,
    totalCreditos,
    totalDebitos,
    balanceMes,
    creditos,
    debitos,
  };

  return NextResponse.json(response);
}