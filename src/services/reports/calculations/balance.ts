import type { Movimiento } from "@/types";

export const calcularBalance = (movimientos: Movimiento[]): number => {
  return movimientos.reduce((acc, mov) => {
    return mov.tipo === "credito" ? acc + mov.monto : acc - mov.monto;
  }, 0);
};
export const sumarTotales = (totales: Record<string, number>): number => {
  return Object.values(totales).reduce((acc, valor) => acc + valor, 0);
};
