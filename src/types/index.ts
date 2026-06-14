/**
 * Representa una fila cruda del archivo Excel antes de ser transformada.
 * Las columnas esperadas son: DIA, CONCEPTO, DEBITO, CREDITO.
 */
export type RowExcel = {
  Fecha: unknown;
  Asunto: unknown;
  "Débito"?: unknown;
  "Crédito"?: unknown;
  "Número de documento"?:  unknown;
  "Descripción"?:          unknown;
  "Asunto Oficial"?:       unknown;
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
  nroDocumento?:   string;
  descripcion?:    string;
  asuntoOficial?:  string;
};