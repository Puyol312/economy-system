import type { Movimiento } from "../movimiento";

export type ComparacionMensualDTO = {
  mesAnterior: string | null;

  totalCreditosAnterior: number | null;
  totalDebitosAnterior: number | null;
  balanceMesAnterior: number | null;

  variacionCreditos: number | null;
  variacionDebitos: number | null;
  variacionBalance: number | null;
};

export type ReporteMensualResponseDTO = {
  meses: string[];
  mes: string;
  balancePorDia: Record<string, number>;
  creditosPorDia: Record<string, number>;
  debitosPorDia: Record<string, number>;
  totalCreditos: number;
  totalDebitos: number;
  balanceMes: number;
  saldoAlCierre: number;
  creditos: [string, number][];
  debitos: [string, number][];
  movimientosMes: Movimiento[];
  comparacion: ComparacionMensualDTO;
};
