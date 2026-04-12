import * as XLSX from "xlsx";
import { mapearMovimientos } from "./mapearMovimientos";
import type { Movimiento, RowExcel } from "@/types";

/**
 * parseExcel
 *
 * Versión server-side del parseo del Excel. Recibe un `Buffer` de Node.js
 * (obtenido desde el `FormData` del endpoint), lee la primera hoja
 * y devuelve los movimientos normalizados.
 *
 * A diferencia de la versión browser que usa `file.arrayBuffer()`,
 * esta función opera directamente con `Buffer` de Node, por lo que
 * solo debe usarse dentro de un Route Handler o Server Action.
 *
 * @param buffer - Contenido del archivo `.xlsx` como Buffer de Node.js.
 * @returns Arreglo de movimientos normalizados.
 *
 * @throws Error si el archivo está corrupto o no tiene hojas.
 *
 * @example
 * // Dentro de un route handler (app/api/upload/route.ts)
 * const bytes = await file.arrayBuffer();
 * const buffer = Buffer.from(bytes);
 * const movimientos = parseExcel(buffer);
 */
export const parseExcel = (buffer: Buffer): Movimiento[] => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("El archivo no contiene hojas.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RowExcel>(sheet);
  console.log("Filas leidas del Excel sin mapear:", rows);
  console.log("Exel parseado", mapearMovimientos(rows));
  return mapearMovimientos(rows);
};