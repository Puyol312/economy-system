import type { Movimiento } from "@/types";

/**
 * filtrarPorConceptosExcluidos
 *
 * Devuelve los movimientos que NO pertenecen a un concepto excluido.
 * Créditos y débitos se filtran con sets independientes, para que
 * un mismo nombre de concepto pueda excluirse de uno sin afectar
 * al otro.
 *
 * @example
 * filtrarPorConceptosExcluidos(
 *   movimientos,
 *   new Set(),           // sin créditos excluidos
 *   new Set(["Ahorros"]), // "Ahorros" excluido de débitos
 * );
 */
export const filtrarPorConceptosExcluidos = (
  movimientos: Movimiento[],
  excluidosCreditos: Set<string>,
  excluidosDebitos: Set<string>,
): Movimiento[] => {
  return movimientos.filter((mov) => {
    const excluidos = mov.tipo === "credito" ? excluidosCreditos : excluidosDebitos;
    return !excluidos.has(mov.concepto);
  });
};
