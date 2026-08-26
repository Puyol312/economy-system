export type TipoMovimiento = "credito" | "debito";

export type Movimiento = {
  dia: string;
  concepto: string;
  monto: number;
  tipo: TipoMovimiento;
  nroDocumento?: string;
  descripcion?: string;
  asuntoOficial?: string;
};