import type { Movimiento } from "@/types";
import { calcularBalance } from "./balance";
import { redondearMonto, redondearTotales } from "@/lib/money";

/**
 * Agrupa una lista de movimientos por mes ("YYYY-MM").
 *
 * Es la base que reutilizan el resto de las funciones de este
 * archivo para no repetir la misma lógica de agrupación.
 *
 * @example
 * agruparMovimientosPorMes([
 *   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 *   { dia: "2026-05-01", concepto: "Freelance", monto: 10000, tipo: "credito" },
 * ]);
 * // { "2026-04": [...], "2026-05": [...] }
 */
export const agruparMovimientosPorMes = (
  movimientos: Movimiento[],
): Record<string, Movimiento[]> => {
  return movimientos.reduce(
    (acc, mov) => {
      const [anio, mm] = mov.dia.split("-");
      const mes = `${anio}-${mm}`;

      if (!acc[mes]) {
        acc[mes] = [];
      }

      acc[mes].push(mov);

      return acc;
    },
    {} as Record<string, Movimiento[]>,
  );
};

/**
 * Calcula el balance (créditos - débitos) agrupado por mes,
 * reutilizando `agruparMovimientosPorMes` y `calcularBalance`.
 */
export const calcularBalancePorMes = (
  movimientos: Movimiento[],
): Record<string, number> => {
  const movimientosPorMes = agruparMovimientosPorMes(movimientos);
  const resultado: Record<string, number> = {};

  for (const mes in movimientosPorMes) {
    resultado[mes] = calcularBalance(movimientosPorMes[mes]);
  }

  return resultado;
};

/**
 * Calcula los totales agrupados por mes para un tipo específico de movimiento.
 * Reutiliza `agruparMovimientosPorMes` para no repetir la lógica de agrupación.
 */
export const obtenerTotalesPorMes = (
  movimientos: Movimiento[],
  tipo: "credito" | "debito",
): Record<string, number> => {
  const movimientosPorMes = agruparMovimientosPorMes(movimientos);
  const resultado: Record<string, number> = {};

  for (const mes in movimientosPorMes) {
    resultado[mes] = movimientosPorMes[mes].reduce((acc, mov) => {
      return mov.tipo === tipo ? acc + mov.monto : acc;
    }, 0);
  }

  return redondearTotales(resultado);
};

/**
 * Suma todos los valores de un objeto de totales agrupados (por mes, día, etc.).
 * Genérica: sirve tanto para totales por mes como para balances por mes.
 */
export const obtenerAcumulado = (totales: Record<string, number>): number => {
  const suma = Object.values(totales).reduce((acc, valor) => acc + valor, 0);

  return redondearMonto(suma);
};

/**
 * Calcula el saldo acumulado mes a mes: cada mes parte del saldo
 * final del mes anterior, a diferencia de `calcularBalancePorMes`
 * que da el balance de cada mes de forma independiente.
 */
export const calcularSaldoAcumulado = (
  movimientos: Movimiento[],
): Record<string, number> => {
  const balancePorMes = calcularBalancePorMes(movimientos);
  const mesesOrdenados = Object.keys(balancePorMes).sort();

  let saldoAcumulado = 0;
  const resultado: Record<string, number> = {};

  for (const mes of mesesOrdenados) {
    saldoAcumulado = redondearMonto(saldoAcumulado + balancePorMes[mes]);
    resultado[mes] = saldoAcumulado;
  }

  return resultado;
};
