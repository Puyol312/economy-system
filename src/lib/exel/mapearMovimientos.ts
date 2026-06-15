import type { RowExcel, Movimiento } from "@/types";

/**
 * parsearFecha
 *
 * Convierte una fecha en formato MM/DD/AAAA al formato AAAA-MM-DD
 * que usan los controladores internamente.
 *
 * @param fecha - Fecha en formato MM/DD/AAAA. Ej: "04/01/2026"
 * @returns Fecha en formato AAAA-MM-DD. Ej: "2026-04-01"
 *
 * @example
 * parsearFecha("04/01/2026") // "2026-04-01"
 * parsearFecha("12/31/2026") // "2026-12-31"
 */
const parsearFecha = (fecha: string): string => {
  const [mm, dd, aaaa] = fecha.split("/");
  return `${aaaa}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};
/**
 * esFechaValida
 *
 * \Valida que la fecha tenga el formato MM/DD/AAAA y que no este vacia.
 * Si no es una cadena o no tiene el formato correcto, devuelve false.
 *
 * @param fecha - Fecha en formato MM/DD/AAAA. Ej: "04/01/2026"
 * @returns boolean indicando si la fecha es valida o no.
 *
 * @example
 * esFechaValida("04/01/2026") // true
 * esFechaValida("12/31/2026") // true
 * esFechaValida("2026-04-01") // false
 * esFechaValida("")             // false
 * esFechaValida(null)           // false
 * esFechaValida(undefined)      // false
 */
const esFechaValida = (fecha: unknown): fecha is string => {
  if (typeof fecha !== "string") return false;
  const partes = fecha.split("/");
  return partes.length === 3 && partes.every(p => p.length > 0);
};
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
				(
					typeof row["Número de documento"] === "string" &&
					row["Número de documento"].trim()
				) ?
					row["Número de documento"].trim()
				:	undefined;
			const desc =
				typeof row["Descripción"] === "string" && row["Descripción"].trim() ?
					row["Descripción"].trim()
				:	undefined;

			const asOficial =
				(
					typeof row["Asunto Oficial"] === "string" &&
					row["Asunto Oficial"].trim()
				) ?
					row["Asunto Oficial"].trim()
				:	undefined;

      if (credito > 0) {
        return {
          dia:      parsearFecha(row.Fecha),
          concepto: row.Asunto,
          monto:    credito,
          tipo: "credito" as const,
          ...(nroDoc    && { nroDocumento:  nroDoc    }),
          ...(desc      && { descripcion:   desc      }),
          ...(asOficial && { asuntoOficial: asOficial }),
        };
      }

      if (debito > 0) {
        return {
          dia:      parsearFecha(row.Fecha),
          concepto: row.Asunto,
          monto:    debito,
          tipo: "debito" as const,
          ...(nroDoc    && { nroDocumento:  nroDoc    }),
          ...(desc      && { descripcion:   desc      }),
          ...(asOficial && { asuntoOficial: asOficial }),
        };
      }

      return null;
    })
    .filter((mov): mov is Movimiento => mov !== null);
};