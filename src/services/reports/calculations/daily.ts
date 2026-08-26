import type { Movimiento } from "@/types";
type BalancePorDia = Record<string, number>;
/**
 * Calcula el balance agrupado por día a partir de una lista de movimientos.
 *
 * Recorre todos los movimientos y construye un objeto donde:
 * - Cada clave es un día (`mov.dia`).
 * - Cada valor es el balance neto de ese día.
 *
 * Para cada movimiento:
 * - Si es "credito", se suma su monto.
 * - Si es "debito", se resta su monto.
 *
 * El algoritmo utiliza `reduce` para:
 * 1. Crear dinámicamente las claves (días) en el objeto acumulador.
 * 2. Inicializar cada día en 0 si aún no existe.
 * 3. Acumular el valor correspondiente en cada día.
 *
 * Esto elimina implícitamente las repeticiones de días,
 * ya que todos los movimientos del mismo día se agrupan
 * bajo una única clave.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 *
 * @returns Un objeto (Record<string, number>) donde:
 * - La clave es el día (string).
 * - El valor es el balance neto de ese día.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-01", concepto: "Alquiler", monto: 18000, tipo: "debito" },
 *   { dia: "2026-04-02", concepto: "Supermercado", monto: 3000, tipo: "debito" }
 * ];
 *
 * calcularBalancePorDia(movimientos);
 *
 * // Resultado:
 * // {
 * //   "2026-04-01": 32000,
 * //   "2026-04-02": -3000
 * // }
 */
export const calcularBalancePorDia = (movimientos: Movimiento[]): BalancePorDia => {
  return movimientos.reduce((acc, mov) => {
    const valor = mov.tipo === "credito" ? mov.monto : -mov.monto;

    if (!acc[mov.dia]) {
      acc[mov.dia] = 0;
    }

    acc[mov.dia] += valor;

    return acc;
  }, {} as BalancePorDia);
};
/**
 * Calcula el total de montos agrupados por día para un tipo específico de movimiento.
 *
 * Esta función permite obtener, de forma genérica, los totales diarios de:
 * - Créditos ("credito")
 * - Débitos ("debito")
 *
 * Recorre la lista de movimientos y:
 * 1. Filtra los movimientos según el tipo indicado.
 * 2. Agrupa los movimientos por día (`mov.dia`).
 * 3. Suma los montos de todos los movimientos del mismo tipo que ocurren en cada día.
 *
 * Internamente utiliza el método `reduce`, que construye un objeto acumulador donde:
 * - Cada clave es una fecha.
 * - Cada valor es el total acumulado para ese tipo en ese día.
 *
 * Si un día no tiene movimientos del tipo indicado, no aparece en el resultado.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 * @param tipo - Tipo de movimiento a considerar:
 *               "credito" para ingresos,
 *               "debito" para egresos.
 *
 * @returns Un objeto (Record<string, number>) donde:
 * - La clave es el día (string).
 * - El valor es la suma total de montos para ese tipo en ese día.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-01", concepto: "Freelance", monto: 10000, tipo: "credito" },
 *   { dia: "2026-04-01", concepto: "Alquiler", monto: 18000, tipo: "debito" }
 * ];
 *
 * obtenerTotalesPorDia(movimientos, "credito");
 * // {
 * //   "2026-04-01": 60000
 * // }
 *
 * obtenerTotalesPorDia(movimientos, "debito");
 * // {
 * //   "2026-04-01": 18000
 * // }
 */
export const obtenerTotalesPorDia = ( movimientos: Movimiento[], tipo: "credito" | "debito"): Record<string, number> => {
  return movimientos.reduce((acc, mov) => {
    if (mov.tipo !== tipo) return acc;

    if (!acc[mov.dia]) {
      acc[mov.dia] = 0;
    }
    acc[mov.dia] += mov.monto;

    return acc;
  }, {} as Record<string, number>);
};