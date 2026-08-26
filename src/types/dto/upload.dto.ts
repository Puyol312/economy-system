import type { Movimiento } from "../movimiento";

export type UploadResponseDTO = {
  hojas: string[];
  movimientosPorHoja: Record<string, Movimiento[]>;
};