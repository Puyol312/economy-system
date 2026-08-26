import type { Movimiento, ReporteDatosResponseDTO } from "@/types";

import { agruparMovimientosPorMes } from "./calculations/monthly";

export const generarReporteDatos = ( movimientos: Movimiento[] ): ReporteDatosResponseDTO => {
  const agrupados = agruparMovimientosPorMes(movimientos);

  const meses = Object.keys(agrupados).sort();

  const movimientosPorMes: Record<string, Movimiento[]> = {};

  for (const mes of meses) {
    movimientosPorMes[mes] = [...agrupados[mes]].sort(
      (a, b) => a.dia.localeCompare(b.dia),
    );
  }

  return {
    meses,
    movimientosPorMes,
  };
};