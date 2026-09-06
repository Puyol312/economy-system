import type { Movimiento, ReporteMensualResponseDTO } from "@/types";
import { calcularBalance, sumarTotales } from "./calculations/balance";
import { calcularBalancePorDia, obtenerTotalesPorDia } from "./calculations/daily";
import { agruparPorConcepto } from "./calculations/concepts";

import { agruparMovimientosPorMes, calcularSaldoAcumulado } from "./calculations/monthly";

export const generarReporteMensual = (
  movimientos: Movimiento[],
  mesParam?: string,
): ReporteMensualResponseDTO | null => {
  const movimientosPorMes = agruparMovimientosPorMes(movimientos);

  const meses = Object.keys(movimientosPorMes).sort();

  if (meses.length === 0) {
    return null;
  }

  const mes =
    mesParam && movimientosPorMes[mesParam] ? mesParam : meses[meses.length - 1];
  const movimientosMes = movimientosPorMes[mes] ?? [];

  // ── Datos del mes seleccionado ───────────────────────────────

  const balancePorDia = calcularBalancePorDia(movimientosMes);
  const creditosPorDia = obtenerTotalesPorDia(movimientosMes, "credito");
  const debitosPorDia = obtenerTotalesPorDia(movimientosMes, "debito");
  const totalCreditos = sumarTotales(creditosPorDia);
  const totalDebitos = sumarTotales(debitosPorDia);
  const balanceMes = calcularBalance(movimientosMes);
  const creditos = agruparPorConcepto(movimientosMes, "credito");
  const debitos = agruparPorConcepto(movimientosMes, "debito");
  const saldoAcumuladoPorMes = calcularSaldoAcumulado(movimientos);
  const saldoAlCierre = saldoAcumuladoPorMes[mes] ?? 0;

  // ── Mes anterior ──────────────────────────────────────────────

  const indiceMes = meses.indexOf(mes);
  const mesAnterior = indiceMes > 0 ? meses[indiceMes - 1] : null;

  let totalCreditosAnterior: number | null = null;
  let totalDebitosAnterior: number | null = null;
  let balanceMesAnterior: number | null = null;

  let variacionCreditos: number | null = null;
  let variacionDebitos: number | null = null;
  let variacionBalance: number | null = null;

  if (mesAnterior) {
    const movimientosMesAnterior = movimientosPorMes[mesAnterior] ?? [];

    const creditosMesAnterior = obtenerTotalesPorDia(movimientosMesAnterior, "credito");
    const debitosMesAnterior = obtenerTotalesPorDia(movimientosMesAnterior, "debito");
    totalCreditosAnterior = sumarTotales(creditosMesAnterior);
    totalDebitosAnterior = sumarTotales(debitosMesAnterior);
    balanceMesAnterior = calcularBalance(movimientosMesAnterior);

    variacionCreditos = calcularVariacion(totalCreditosAnterior, totalCreditos);
    variacionDebitos = calcularVariacion(totalDebitosAnterior, totalDebitos);
    variacionBalance = calcularVariacion(balanceMesAnterior, balanceMes);
  }

  return {
    meses,
    mes,
    balancePorDia,
    creditosPorDia,
    debitosPorDia,
    totalCreditos,
    totalDebitos,
    balanceMes,
    saldoAlCierre,
    creditos,
    debitos,
    movimientosMes,

    comparacion: {
      mesAnterior,
      totalCreditosAnterior,
      totalDebitosAnterior,
      balanceMesAnterior,
      variacionCreditos,
      variacionDebitos,
      variacionBalance,
    },
  };
};

const calcularVariacion = (anterior: number, actual: number): number | null => {
  if (anterior === 0) {
    return actual === 0 ? 0 : null;
  }

  return ((actual - anterior) / Math.abs(anterior)) * 100;
};
