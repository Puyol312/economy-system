import type { Movimiento } from "@/types";
import { redondearTotales } from "@/lib/money";

type BalancePorDia = Record<string, number>;

/**
 * Calcula el balance agrupado por día (créditos suman, débitos restan).
 *
 * @example
 * calcularBalancePorDia([
 *   { dia: "2026-04-01", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-01", monto: 18000, tipo: "debito" },
 * ]);
 * // { "2026-04-01": 32000 }
 */
export const calcularBalancePorDia = (movimientos: Movimiento[]): BalancePorDia => {
  const acumulado = movimientos.reduce((acc, mov) => {
    const valor = mov.tipo === "credito" ? mov.monto : -mov.monto;

    if (!acc[mov.dia]) {
      acc[mov.dia] = 0;
    }

    acc[mov.dia] += valor;

    return acc;
  }, {} as BalancePorDia);

  return redondearTotales(acumulado);
};

/**
 * Suma los montos agrupados por día para un tipo específico de movimiento.
 * Un día sin movimientos de ese tipo no aparece en el resultado.
 *
 * @example
 * obtenerTotalesPorDia(movimientos, "credito");
 * // { "2026-04-01": 60000 }
 */
export const obtenerTotalesPorDia = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito",
): Record<string, number> => {
  const acumulado = movimientos.reduce(
    (acc, mov) => {
      if (mov.tipo !== tipo) return acc;

      if (!acc[mov.dia]) {
        acc[mov.dia] = 0;
      }
      acc[mov.dia] += mov.monto;

      return acc;
    },
    {} as Record<string, number>,
  );

  return redondearTotales(acumulado);
};
