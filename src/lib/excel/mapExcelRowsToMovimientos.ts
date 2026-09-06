import type { RowExcel, Movimiento } from "@/types";
import { parsearFecha, esFechaValida } from "./excelDate";

/**
 * mapearMovimientos
 *
 * Transforma un arreglo de filas crudas del Excel en un arreglo
 * de objetos `Movimiento` normalizados.
 *
 * Espera las columnas `FECHA` (MM/DD/AAAA) y `ASUNTO` del Excel.
 * La fecha se convierte internamente a `AAAA-MM-DD` para que los
 * controladores funcionen correctamente sin depender de zona horaria.
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
 *   { FECHA: "04/01/2026", ASUNTO: "Sueldo",       CREDITO: 50000 },
 *   { FECHA: "04/02/2026", ASUNTO: "Supermercado", DEBITO: 3000   },
 * ];
 *
 * mapearMovimientos(rows);
 * // [
 * //   { dia: "2026-04-01", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
 * //   { dia: "2026-04-02", concepto: "Supermercado", monto: 3000,  tipo: "debito"  },
 * // ]
 */
export const mapearMovimientos = (rows: RowExcel[]): Movimiento[] => {
  return rows
    .map((row) => {
      if (!esFechaValida(row.Fecha)) return null;
      if (typeof row.Asunto !== "string" || !row.Asunto.trim()) return null;

      const credito = Number(row["Crédito"]) || 0;
      const debito = Number(row["Débito"]) || 0;

      const nroDoc =
        typeof row["Número de documento"] === "string" &&
        row["Número de documento"].trim()
          ? row["Número de documento"].trim()
          : undefined;
      const desc =
        typeof row["Descripción"] === "string" && row["Descripción"].trim()
          ? row["Descripción"].trim()
          : undefined;

      const asOficial =
        typeof row["Asunto Oficial"] === "string" && row["Asunto Oficial"].trim()
          ? row["Asunto Oficial"].trim()
          : undefined;

      if (credito > 0) {
        return {
          dia: parsearFecha(row.Fecha),
          concepto: row.Asunto,
          monto: credito,
          tipo: "credito" as const,
          ...(nroDoc && { nroDocumento: nroDoc }),
          ...(desc && { descripcion: desc }),
          ...(asOficial && { asuntoOficial: asOficial }),
        };
      }

      if (debito > 0) {
        return {
          dia: parsearFecha(row.Fecha),
          concepto: row.Asunto,
          monto: debito,
          tipo: "debito" as const,
          ...(nroDoc && { nroDocumento: nroDoc }),
          ...(desc && { descripcion: desc }),
          ...(asOficial && { asuntoOficial: asOficial }),
        };
      }

      return null;
    })
    .filter((mov): mov is Movimiento => mov !== null);
};
