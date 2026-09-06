import type { Movimiento } from "../movimiento";

export type ReporteDatosResponseDTO = {
  meses: string[];
  movimientosPorMes: Record<string, Movimiento[]>;
};
