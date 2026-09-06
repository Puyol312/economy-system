import type { Movimiento } from "@/types";
import { redondearMonto } from "@/lib/money";

export const calcularBalance = (movimientos: Movimiento[]): number => {
  const balance = movimientos.reduce((acc, mov) => {
    return mov.tipo === "credito" ? acc + mov.monto : acc - mov.monto;
  }, 0);

  return redondearMonto(balance);
};

export const sumarTotales = (totales: Record<string, number>): number => {
  const suma = Object.values(totales).reduce((acc, valor) => acc + valor, 0);

  return redondearMonto(suma);
};
