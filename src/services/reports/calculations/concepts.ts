import type { Movimiento } from "@/types";
import { redondearMonto } from "@/lib/money";

/**
 * Agrupa los movimientos por concepto para un tipo específico y suma
 * sus montos. El resultado se ordena de mayor a menor monto.
 *
 * Útil para mostrar un ranking de los conceptos con mayor incidencia
 * en créditos o débitos dentro de un período.
 *
 * @example
 * agruparPorConcepto(movimientos, "credito");
 * // [["Sueldo", 55000], ["Freelance", 10000]]
 */
export const agruparPorConcepto = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito",
): [string, number][] => {
  const agrupado = movimientos.reduce(
    (acc, mov) => {
      if (mov.tipo !== tipo) return acc;

      if (!acc[mov.concepto]) {
        acc[mov.concepto] = 0;
      }

      acc[mov.concepto] += mov.monto;

      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(agrupado)
    .map(([concepto, total]) => [concepto, redondearMonto(total)] as [string, number])
    .sort(([, a], [, b]) => b - a);
};
