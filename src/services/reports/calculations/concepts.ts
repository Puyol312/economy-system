import type { Movimiento } from "@/types";

/**
 * agruparPorConcepto
 *
 * Agrupa los movimientos por concepto para un tipo específico
 * y suma sus montos. El resultado se ordena de mayor a menor.
 *
 * Útil para mostrar un ranking de los conceptos con mayor
 * incidencia en créditos o débitos dentro de un período.
 *
 * Proceso:
 * 1. Filtra los movimientos por el tipo indicado.
 * 2. Agrupa los movimientos bajo la clave `concepto`.
 * 3. Acumula el monto de cada movimiento del mismo concepto.
 * 4. Ordena el resultado de mayor a menor monto.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 * @param tipo - Tipo de movimiento: "credito" | "debito".
 *
 * @returns Un array de tuplas [concepto, total] ordenado de mayor a menor.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-05", concepto: "Freelance",    monto: 10000, tipo: "credito" },
 *   { dia: "2026-04-05", concepto: "Sueldo",       monto: 5000,  tipo: "credito" },
 *   { dia: "2026-04-02", concepto: "Supermercado", monto: 8000,  tipo: "debito"  },
 * ];
 *
 * agruparPorConcepto(movimientos, "credito");
 * // [
 * //   ["Sueldo",    55000],
 * //   ["Freelance", 10000],
 * // ]
 *
 * agruparPorConcepto(movimientos, "debito");
 * // [
 * //   ["Supermercado", 8000],
 * // ]
 */
export const agruparPorConcepto = ( movimientos: Movimiento[], tipo: "credito" | "debito"): [string, number][] => {
  const agrupado = movimientos.reduce((acc, mov) => {
    if (mov.tipo !== tipo) return acc;

    if (!acc[mov.concepto]) {
      acc[mov.concepto] = 0;
    }

    acc[mov.concepto] += mov.monto;

    return acc;
  }, {} as Record<string, number>);

  return Object.entries(agrupado).sort(([, a], [, b]) => b - a);
};