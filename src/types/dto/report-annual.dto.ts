export type ReporteAnualResponseDTO = {
  balancePorMes: Record<string, number>;
  saldoAcumulado: Record<string, number>;

  creditosPorMes: Record<string, number>;
  debitosPorMes: Record<string, number>;

  totalCreditos: number;
  totalDebitos: number;

  balanceAnual: number;
  mejorMes: string;
};