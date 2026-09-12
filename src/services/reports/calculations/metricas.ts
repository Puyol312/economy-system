import type { Movimiento } from "@/types";
import { calcularBalance, sumarTotales } from "./balance";
import { calcularBalancePorDia, obtenerTotalesPorDia } from "./daily";
import { agruparPorConcepto } from "./concepts";
import { filtrarPorConceptosExcluidos } from "@/lib/filtrarMovimientos";

export interface MetricasFiltradas {
  balancePorDia: Record<string, number>;
  creditosPorDia: Record<string, number>;
  debitosPorDia: Record<string, number>;
  totalCreditos: number;
  totalDebitos: number;
  balanceMes: number;
  creditosPorConcepto: [string, number][];
  debitosPorConcepto: [string, number][];
}

/**
 * calcularMetricasFiltradas
 *
 * Recalcula todas las métricas de un período (balance por día,
 * totales por día, totales, balance, y conceptos agrupados) a
 * partir de un subconjunto de movimientos que excluye los
 * conceptos indicados.
 *
 * Es la misma lógica que usa `generarReporteMensual` en el
 * servidor, pero pensada para correr del lado del cliente sobre
 * los movimientos que ya están cargados (sin pedirle nada nuevo
 * al backend). La usan tanto `/mensual` (un mes) como `/comparar`
 * (dos meses, cada uno con su propio llamado a esta función).
 *
 * No incluye `saldoAlCierre` a propósito: ese valor depende del
 * acumulado histórico completo, no de un mes filtrado, y en la
 * UI se muestra tal cual viene del reporte del servidor.
 */
export const calcularMetricasFiltradas = (
  movimientos: Movimiento[],
  excluidosCreditos: Set<string>,
  excluidosDebitos: Set<string>,
): MetricasFiltradas => {
  const filtrados = filtrarPorConceptosExcluidos(
    movimientos,
    excluidosCreditos,
    excluidosDebitos,
  );

  const creditosPorDia = obtenerTotalesPorDia(filtrados, "credito");
  const debitosPorDia = obtenerTotalesPorDia(filtrados, "debito");

  return {
    balancePorDia: calcularBalancePorDia(filtrados),
    creditosPorDia,
    debitosPorDia,
    totalCreditos: sumarTotales(creditosPorDia),
    totalDebitos: sumarTotales(debitosPorDia),
    balanceMes: calcularBalance(filtrados),
    creditosPorConcepto: agruparPorConcepto(filtrados, "credito"),
    debitosPorConcepto: agruparPorConcepto(filtrados, "debito"),
  };
};
