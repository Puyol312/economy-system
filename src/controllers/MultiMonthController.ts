import { Movimiento } from "@/types";
import { calcularBalance } from "./SingleMonthController";

/**
 * Calcula el balance (créditos - débitos) agrupado por mes,
 * reutilizando la función `calcularBalance`.
 *
 * Proceso:
 * 1. Recorre todos los movimientos.
 * 2. Agrupa los movimientos en un objeto donde la clave es el mes ("YYYY-MM")
 *    y el valor es un array de movimientos de ese mes.
 * 3. Para cada mes, aplica la función `calcularBalance` ya definida,
 *    evitando duplicar lógica de cálculo.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 *
 * @returns Un objeto (Record<string, number>) donde:
 * - La clave es el mes en formato "YYYY-MM".
 * - El valor es el balance neto (créditos - débitos) de ese mes.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-10", monto: 20000, tipo: "debito" },
 *   { dia: "2026-05-01", monto: 10000, tipo: "credito" }
 * ];
 *
 * calcularBalancePorMes(movimientos);
 *
 * // {
 * //   "2026-04": 30000,
 * //   "2026-05": 10000
 * // }
 */
export const calcularBalancePorMes = (
  movimientos: Movimiento[]
): Record<string, number> => {
  const movimientosPorMes: Record<string, Movimiento[]> = {};

  for (const mov of movimientos) {
    const [anio, mm] = mov.dia.split("-");
    const mes = `${anio}-${mm}`;

    if (!movimientosPorMes[mes]) {
      movimientosPorMes[mes] = [];
    }

    movimientosPorMes[mes].push(mov);
  }

  const resultado: Record<string, number> = {};

  for (const mes in movimientosPorMes) {
    resultado[mes] = calcularBalance(movimientosPorMes[mes]);
  }

  return resultado;
};
/**
 * Calcula los totales agrupados por mes para un tipo específico de movimiento.
 *
 * Reutiliza el enfoque de funciones previas separando responsabilidades:
 * - Agrupa movimientos por mes.
 * - Para cada mes, filtra por tipo ("credito" o "debito").
 * - Suma los montos correspondientes.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 * @param tipo - Tipo de movimiento a considerar ("credito" | "debito").
 *
 * @returns Un objeto (Record<string, number>) donde:
 * - La clave es el mes en formato "YYYY-MM".
 * - El valor es el total acumulado de ese tipo en ese mes.
 *
 * @example
 * obtenerTotalesPorMes(movimientos, "credito");
 * // { "2026-04": 60000, "2026-05": 10000 }
 *
 * obtenerTotalesPorMes(movimientos, "debito");
 * // { "2026-04": 20000 }
 */
export const obtenerTotalesPorMes = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito"
): Record<string, number> => {
  const movimientosPorMes: Record<string, Movimiento[]> = {};

  for (const mov of movimientos) {
    const [anio, mm] = mov.dia.split("-");
    const mes = `${anio}-${mm}`;

    if (!movimientosPorMes[mes]) {
      movimientosPorMes[mes] = [];
    }

    movimientosPorMes[mes].push(mov);
  }

  const resultado: Record<string, number> = {};

  for (const mes in movimientosPorMes) {
    resultado[mes] = movimientosPorMes[mes].reduce((acc, mov) => {
      return mov.tipo === tipo ? acc + mov.monto : acc;
    }, 0);
  }

  return resultado;
};
/**
 * Calcula el total acumulado a partir de un objeto de totales agrupados (por mes, día, etc.).
 *
 * Esta función es genérica y reutilizable, ya que funciona con cualquier estructura
 * del tipo Record<string, number>, como:
 * - Totales por mes
 * - Totales por día
 * - Balance por mes
 *
 * Proceso:
 * 1. Obtiene todos los valores del objeto usando `Object.values`.
 * 2. Aplica `reduce` para sumar todos los valores.
 *
 * @param totales - Objeto con valores numéricos agrupados (por mes, día, etc.).
 *
 * @returns Un número que representa la suma total de todos los valores.
 *
 * @example
 * const creditosPorMes = {
 *   "2026-04": 60000,
 *   "2026-05": 10000
 * };
 *
 * obtenerAcumulado(creditosPorMes); // 70000
 *
 * const balancePorMes = {
 *   "2026-04": 40000,
 *   "2026-05": -2000
 * };
 *
 * obtenerAcumulado(balancePorMes); // 38000
 */
export const obtenerAcumulado = (
  totales: Record<string, number>
): number => {
  return Object.values(totales).reduce((acc, valor) => acc + valor, 0);
};
/**
 * Agrupa una lista de movimientos por mes.
 *
 * Recibe un arreglo de objetos `Movimiento` y los organiza en un objeto
 * donde cada clave representa un mes en formato "YYYY-MM" y su valor
 * es un arreglo con todos los movimientos correspondientes a ese mes.
 *
 * Proceso:
 * 1. Recorre todos los movimientos.
 * 2. Para cada movimiento:
 *    - Convierte la fecha (`mov.dia`) a un objeto Date.
 *    - Extrae el año y el mes.
 *    - Genera una clave en formato "YYYY-MM".
 * 3. Agrupa los movimientos bajo esa clave.
 * 4. Si el mes no existe en el acumulador, lo inicializa como un array vacío.
 *
 * @param movimientos - Array de objetos de tipo Movimiento.
 *
 * @returns Un objeto (Record<string, Movimiento[]>) donde:
 * - La clave es el mes en formato "YYYY-MM".
 * - El valor es un arreglo de movimientos correspondientes a ese mes.
 *
 * @example
 * const movimientos = [
 *   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 *   { dia: "2026-04-10", concepto: "Alquiler", monto: 20000, tipo: "debito" },
 *   { dia: "2026-05-01", concepto: "Freelance", monto: 10000, tipo: "credito" }
 * ];
 *
 * agruparMovimientosPorMes(movimientos);
 *
 * // Resultado:
 * // {
 * //   "2026-04": [
 * //     { dia: "2026-04-01", ... },
 * //     { dia: "2026-04-10", ... }
 * //   ],
 * //   "2026-05": [
 * //     { dia: "2026-05-01", ... }
 * //   ]
 * // }
 */
export const agruparMovimientosPorMes = (
  movimientos: Movimiento[]
): Record<string, Movimiento[]> => {
  return movimientos.reduce((acc, mov) => {
    const [anio, mm] = mov.dia.split("-");
    const mes = `${anio}-${mm}`;

    if (!acc[mes]) {
      acc[mes] = [];
    }

    acc[mes].push(mov);

    return acc;
  }, {} as Record<string, Movimiento[]>);
};