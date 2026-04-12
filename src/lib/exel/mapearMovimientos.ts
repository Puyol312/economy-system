import type { RowExcel, Movimiento } from "@/types";

/**
 * mapearMovimientos
 *
 * Transforma un arreglo de filas crudas del Excel en un arreglo
 * de objetos `Movimiento` normalizados.
 *
 * - Si `CREDITO > 0` → tipo "credito"
 * - Si `DEBITO > 0`  → tipo "debito"
 * - Si ninguno es válido → la fila se ignora
 *
 * Es una función pura, sin dependencias de browser ni de Node,
 * reutilizable tanto en el cliente como en el servidor.
 *
 * @param rows - Filas crudas provenientes del Excel.
 * @returns Arreglo de movimientos normalizados.
 *
 * @example
 * const rows = [
 *   { DIA: "2026-04-01", CONCEPTO: "Sueldo", CREDITO: 50000 },
 *   { DIA: "2026-04-02", CONCEPTO: "Supermercado", DEBITO: 3000 },
 * ];
 *
 * mapearMovimientos(rows);
 * // [
 * //   { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
 * //   { dia: "2026-04-02", concepto: "Supermercado", monto: 3000, tipo: "debito" },
 * // ]
 */
export const mapearMovimientos = (rows: RowExcel[]): Movimiento[] => {
  return rows
    .map((row) => {
      const credito = Number(row.CREDITO) || 0;
      const debito = Number(row.DEBITO) || 0;

      if (credito > 0) {
        return {
          dia: row.DIA,
          concepto: row.CONCEPTO,
          monto: credito,
          tipo: "credito" as const,
        };
      }

      if (debito > 0) {
        return {
          dia: row.DIA,
          concepto: row.CONCEPTO,
          monto: debito,
          tipo: "debito" as const,
        };
      }

      return null;
    })
    .filter((mov): mov is Movimiento => mov !== null);
};