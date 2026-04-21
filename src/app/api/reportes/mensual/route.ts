import { NextRequest, NextResponse } from "next/server";
import { getMovimientos } from "@/lib/store/movimientosStore";
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
 * La página `/mensual` lo consume directamente para alimentar
 * los gráficos, las tarjetas de resumen y la tabla de conceptos.
 */
export interface ReporteMensualResponse {
  /** Lista de meses disponibles en la hoja, en formato "YYYY-MM" ordenados. */
  meses:          string[];
  /** Mes que se está devolviendo en esta respuesta. */
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
 * GET /api/reportes/mensual?hoja=Cuenta Corriente&mes=2026-04
 *
 * Lee los movimientos de la hoja indicada desde el store del servidor,
 * filtra por el mes solicitado y aplica los controladores para devolver
 * todos los cálculos necesarios para renderizar la página `/mensual`.
 *
 * Si `mes` no se provee o no existe en los datos, usa el primer mes
 * disponible automáticamente.
 *
 * Query params:
 * - `hoja` (requerido): nombre de la hoja del Excel a consultar.
 * - `mes`  (opcional): mes a analizar en formato "YYYY-MM".
 *                      Si se omite, usa el primer mes disponible.
 *
 * Respuestas:
 * - `200` → `ReporteMensualResponse`
 * - `400` → `{ message: string }` si falta el parámetro `hoja`.
 * - `404` → `{ message: string }` si la hoja no existe en el store.
 * - `404` → `{ message: string }` si no hay meses disponibles.
 *
 * @example
 * // Con mes específico
 * const res = await fetch("/api/reportes/mensual?hoja=Cuenta Corriente&mes=2026-04");
 *
 * // Sin mes — devuelve el primero disponible
 * const res = await fetch("/api/reportes/mensual?hoja=Cuenta Corriente");
 */
export async function GET(req: NextRequest) {
  const hoja = req.nextUrl.searchParams.get("hoja");
  const mesParam = req.nextUrl.searchParams.get("mes");

  if (!hoja) {
    return NextResponse.json(
      { message: "El parámetro 'hoja' es requerido." },
      { status: 400 }
    );
  }

  const movimientos = getMovimientos(hoja);

  if (!movimientos) {
    return NextResponse.json(
      { message: `No se encontraron datos para la hoja "${hoja}". Subí el archivo primero.` },
      { status: 404 }
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

  // Si no se provee mes o el mes no existe en los datos, usar el primero
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