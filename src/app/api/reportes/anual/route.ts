import { NextRequest, NextResponse } from "next/server";
import { getMovimientos } from "@/lib/store/movimientosStore";
import {
  calcularBalancePorMes,
  obtenerTotalesPorMes,
  obtenerAcumulado,
} from "@/controllers/MultiMonthController";

/**
 * ReporteAnualResponse
 *
 * Estructura del JSON que devuelve este endpoint.
 * La página `/anual` lo consume directamente para alimentar
 * los gráficos y las tarjetas de resumen.
 */
export interface ReporteAnualResponse {
  balancePorMes:  Record<string, number>;
  creditosPorMes: Record<string, number>;
  debitosPorMes:  Record<string, number>;
  totalCreditos:  number;
  totalDebitos:   number;
  balanceAnual:   number;
  mejorMes:       string;
}

/**
 * GET /api/reportes/anual?hoja=Cuenta Corriente
 *
 * Lee los movimientos de la hoja indicada desde el store del servidor,
 * aplica los controladores y devuelve todos los cálculos necesarios
 * para renderizar la página `/anual`.
 *
 * Query params:
 * - `hoja` (requerido): nombre de la hoja del Excel a consultar.
 *
 * Respuestas:
 * - `200` → `ReporteAnualResponse`
 * - `400` → `{ message: string }` si falta el parámetro `hoja`.
 * - `404` → `{ message: string }` si la hoja no existe en el store.
 *
 * @example
 * const res = await fetch("/api/reportes/anual?hoja=Cuenta Corriente");
 * const reporte = await res.json();
 */
export async function GET(req: NextRequest) {
  const hoja = req.nextUrl.searchParams.get("hoja");

  if (!hoja) {
    return NextResponse.json(
      { message: "El parámetro 'hoja' es requerido." },
      { status: 400 }
    );
  }

  const movimientos = getMovimientos(hoja);

  console.log("Total movimientos:", movimientos?.length);
  console.log("Muestra dias:", movimientos?.map(m => m.dia));

  if (!movimientos) {
    return NextResponse.json(
      { message: `No se encontraron datos para la hoja "${hoja}". Subí el archivo primero.` },
      { status: 404 }
    );
  }

  // ── Cálculos ──────────────────────────────────────────────────
  const balancePorMes  = calcularBalancePorMes(movimientos);
  const creditosPorMes = obtenerTotalesPorMes(movimientos, "credito");
  const debitosPorMes  = obtenerTotalesPorMes(movimientos, "debito");

  const totalCreditos  = obtenerAcumulado(creditosPorMes);
  const totalDebitos   = obtenerAcumulado(debitosPorMes);
  const balanceAnual   = obtenerAcumulado(balancePorMes);

  const mejorMes = Object.entries(balancePorMes)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "";

  const response: ReporteAnualResponse = {
    balancePorMes,
    creditosPorMes,
    debitosPorMes,
    totalCreditos,
    totalDebitos,
    balanceAnual,
    mejorMes,
  };

  return NextResponse.json(response);
}