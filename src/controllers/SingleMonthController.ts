import { Movimiento } from "@/types";

type BalancePorDia = Record<string, number>;

/**
 * Calcula el balance total a partir de una lista de movimientos.
 *
 * Recorre todos los movimientos y acumula un valor numérico:
 * - Si el movimiento es de tipo "credito", suma el monto al acumulador.
 * - Si el movimiento es de tipo "debito", resta el monto al acumulador.
 *
 * Internamente utiliza el método `reduce`, que permite recorrer el array
 * y mantener un acumulador (`acc`) que representa el balance parcial.
 *
 * El acumulador comienza en 0, y en cada iteración se actualiza según
 * el tipo de movimiento.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 *
 * @returns Un número que representa el balance total:
 * - Positivo: hay más ingresos que egresos.
 * - Negativo: hay más egresos que ingresos.
 * - Cero: ingresos y egresos se equilibran.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-01", concepto: "Alquiler", monto: 18000, tipo: "debito" }
 * ];
 *
 * calcularBalance(movimientos); // 32000
 */
export const calcularBalance = (movimientos: Movimiento[]) => {
  return movimientos.reduce((acc, mov) => {
    return mov.tipo === "credito"
      ? acc + mov.monto
      : acc - mov.monto;
  }, 0);
};
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
export const calcularBalancePorDia = (
  movimientos: Movimiento[]
): BalancePorDia => {
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
export const obtenerTotalesPorDia = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito"
): Record<string, number> => {
  return movimientos.reduce((acc, mov) => {
    if (mov.tipo !== tipo) return acc;

    if (!acc[mov.dia]) {
      acc[mov.dia] = 0;
    }
    acc[mov.dia] += mov.monto;

    return acc;
  }, {} as Record<string, number>);
};
/**
 * Calcula la suma total de los valores de un objeto de totales por día.
 *
 * Recibe como entrada un objeto donde:
 * - Las claves representan días.
 * - Los valores representan montos acumulados (por ejemplo, créditos o débitos por día).
 *
 * La función:
 * 1. Obtiene todos los valores del objeto usando `Object.values`.
 * 2. Utiliza `reduce` para sumar todos los valores.
 *
 * @param totalesPorDia - Objeto con totales agrupados por día.
 *
 * @returns Un número que representa la suma total de todos los valores.
 *
 * @example
 * const debitosPorDia = {
 *   "2026-04-01": 20000,
 *   "2026-04-02": 4000
 * };
 *
 * sumarTotales(debitosPorDia); // 24000
 */
export const sumarTotales = (
  totalesPorDia: Record<string, number>
): number => {
  return Object.values(totalesPorDia).reduce((acc, valor) => {
    return acc + valor;
  }, 0);
};
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
export const agruparPorConcepto = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito"
): [string, number][] => {
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