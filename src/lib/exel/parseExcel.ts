import * as XLSX from "xlsx";
import { mapearMovimientos } from "./mapearMovimientos";
import type { Movimiento, RowExcel } from "@/types";

/**
 * ResultadoParseo
 *
 * Resultado del parseo de un Excel con múltiples hojas.
 */
export interface ResultadoParseo {
  /** Nombres de las hojas detectadas en el workbook. */
  hojas: string[];
  /**
   * Movimientos parseados por hoja.
   * La clave es el nombre de la hoja.
   */
  movimientosPorHoja: Record<string, Movimiento[]>;
}

/**
 * parseExcel
 *
 * Versión server-side del parseo del Excel. Recibe un `Buffer` de Node.js,
 * recorre todas las hojas del workbook y devuelve los movimientos
 * normalizados agrupados por hoja.
 *
 * A diferencia de la versión anterior que solo procesaba la primera hoja,
 * esta función detecta dinámicamente todas las hojas disponibles.
 *
 * Solo debe usarse dentro de un Route Handler o Server Action.
 *
 * @param buffer - Contenido del archivo `.xlsx` como Buffer de Node.js.
 * @returns Hojas detectadas y movimientos normalizados por hoja.
 *
 * @throws Error si el archivo está corrupto o no tiene hojas.
 *
 * @example
 * // Dentro de app/api/upload/route.ts
 * const bytes = await file.arrayBuffer();
 * const buffer = Buffer.from(bytes);
 * const { hojas, movimientosPorHoja } = parseExcel(buffer);
 */
export const parseExcel = (buffer: Buffer): ResultadoParseo => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  if (!workbook.SheetNames.length) {
    throw new Error("El archivo no contiene hojas.");
  }

  const movimientosPorHoja: Record<string, Movimiento[]> = {};

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<RowExcel>(sheet);
    movimientosPorHoja[sheetName] = mapearMovimientos(rows);
  }

  return {
    hojas: workbook.SheetNames,
    movimientosPorHoja,
  };
};