import { parseExcel } from "@/lib/excel/parseExcel";

import type { UploadResponseDTO } from "@/types";

export const processExcelUpload = (buffer: Buffer): UploadResponseDTO => {
  const { hojas, movimientosPorHoja } = parseExcel(buffer);

  const hojasFiltradas = hojas.filter(
    (hoja) => hoja.toLowerCase() !== "admin",
  );

  const movimientosFiltrados = Object.fromEntries(
    Object.entries(movimientosPorHoja).filter(
      ([hoja]) => hoja.toLowerCase() !== "admin",
    ),
  );

  return {
    hojas: hojasFiltradas,
    movimientosPorHoja: movimientosFiltrados,
  };
};