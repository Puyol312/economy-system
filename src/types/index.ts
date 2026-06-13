/**
 * Representa una fila cruda del archivo Excel antes de ser transformada.
 * Las columnas esperadas son: DIA, CONCEPTO, DEBITO, CREDITO.
 */
export type RowExcel = {
  FECHA: unknown;
  ASUNTO: unknown;
  DEBITO?: unknown;
  CREDITO?: unknown;
};

/**
 * Representa un movimiento financiero ya normalizado.
 * Es el modelo que se usa en toda la aplicación luego del parseo.
 */
export type Movimiento = {
  dia: string;
  concepto: string;
  monto: number;
  tipo: "credito" | "debito";
};