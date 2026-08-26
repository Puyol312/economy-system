import type { Movimiento, ReporteAnualResponseDTO } from "@/types";

import {
  calcularBalancePorMes,
  calcularSaldoAcumulado,
  obtenerAcumulado,
  obtenerTotalesPorMes,
} from "./calculations/monthly";

export const generarReporteAnual = (movimientos: Movimiento[]): ReporteAnualResponseDTO => {
  const saldoAcumulado = calcularSaldoAcumulado(movimientos);

  const balancePorMes = calcularBalancePorMes(movimientos);
  const creditosPorMes = obtenerTotalesPorMes(movimientos, "credito");
  const debitosPorMes = obtenerTotalesPorMes(movimientos, "debito");
  
  const totalCreditos = obtenerAcumulado(creditosPorMes);
  const totalDebitos = obtenerAcumulado(debitosPorMes);

  const balanceAnual = obtenerAcumulado(balancePorMes);
  const mejorMes = Object.entries(balancePorMes).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "";

  return {
    balancePorMes,
    saldoAcumulado,
    creditosPorMes,
    debitosPorMes,
    totalCreditos,
    totalDebitos,
    balanceAnual,
    mejorMes,
  };
};