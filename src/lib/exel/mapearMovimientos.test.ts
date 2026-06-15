import test from "ava";
import { mapearMovimientos } from "./mapearMovimientos";
import type { RowExcel } from "@/types";

// ─── Casos base ───────────────────────────────────────────────────────────────

test("mapea una fila con crédito correctamente", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  ]);
});

test("mapea una fila con débito correctamente", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/02/2026", Asunto: "Supermercado", Débito: 8000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  ]);
});

test("mapea múltiples filas con créditos y débitos", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo",       Crédito: 50000 },
    { Fecha: "04/02/2026", Asunto: "Supermercado", Débito: 8000   },
    { Fecha: "04/03/2026", Asunto: "Freelance",    Crédito: 10000 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 3);
  t.is(result[0].tipo, "credito");
  t.is(result[1].tipo, "debito");
  t.is(result[2].tipo, "credito");
});

// ─── Conversión de fecha ──────────────────────────────────────────────────────

test("convierte fecha MM/DD/AAAA a AAAA-MM-DD correctamente", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-04-01");
});

test("convierte fecha del último día del mes correctamente", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "03/31/2026", Asunto: "Pago", Débito: 1000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-03-31");
});

test("convierte fecha del primer día del mes correctamente", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "03/01/2026", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-03-01");
});

test("convierte correctamente diciembre", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "12/31/2026", Asunto: "Cierre", Crédito: 1000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-12-31");
});

// ─── Filas inválidas ──────────────────────────────────────────────────────────

test("ignora filas sin crédito ni débito", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sin monto" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con crédito y débito en cero", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Cero", Crédito: 0, Débito: 0 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con valores inválidos y procesa las válidas", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sin monto"  },
    { Fecha: "04/02/2026", Asunto: "Sueldo",    Crédito: 50000 },
    { Fecha: "04/03/2026", Asunto: "Otro cero", Débito: 0      },
    { Fecha: "04/04/2026", Asunto: "Alquiler",  Débito: 20000  },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 2);
  t.is(result[0].concepto, "Sueldo");
  t.is(result[1].concepto, "Alquiler");
});

test("devuelve array vacío si no recibe filas", (t) => {
  const result = mapearMovimientos([]);
  t.is(result.length, 0);
});

// ─── Valores numéricos ────────────────────────────────────────────────────────

test("convierte strings numéricos a número", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: "50000" as unknown as number },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].monto, 50000);
});

test("prioriza crédito sobre débito si ambos son mayores a cero", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Raro", Crédito: 1000, Débito: 500 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "credito");
  t.is(result[0].monto, 1000);
});

// ─── Tipos del resultado ──────────────────────────────────────────────────────

test("el tipo del resultado es 'credito' como literal", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "credito");
});

test("el tipo del resultado es 'debito' como literal", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Alquiler", Débito: 20000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "debito");
});

// ─── Validación de fecha ──────────────────────────────────────────────────────

test("ignora filas con fecha que no es string", (t) => {
  const rows: RowExcel[] = [
    { Fecha: 46112 as unknown as string, Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con fecha undefined", (t) => {
  const rows: RowExcel[] = [
    { Fecha: undefined as unknown as string, Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con fecha en formato incorrecto", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "2026-04-01", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con fecha vacía", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "", Asunto: "Sueldo", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

// ─── Validación de Asunto ─────────────────────────────────────────────────────

test("ignora filas con Asunto undefined", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: undefined as unknown as string, Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con Asunto vacío", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "", Crédito: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("procesa correctamente filas válidas junto a filas con fecha inválida", (t) => {
  const rows: RowExcel[] = [
    { Fecha: 46112 as unknown as string, Asunto: "Sueldo",    Crédito: 50000 },
    { Fecha: "04/02/2026",               Asunto: "Freelance", Crédito: 10000 },
    { Fecha: "",                          Asunto: "Alquiler",  Débito: 20000  },
    { Fecha: "04/04/2026",               Asunto: "Gym",       Débito: 3000   },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 2);
  t.is(result[0].concepto, "Freelance");
  t.is(result[1].concepto, "Gym");
});

// ─── Campos opcionales ────────────────────────────────────────────────────────

test("incluye nroDocumento si tiene valor", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Número de documento": "00123456" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].nroDocumento, "00123456");
});

test("no incluye nroDocumento si está vacío", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Número de documento": "" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].nroDocumento, undefined);
});

test("incluye descripcion si tiene valor", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Descripción": "Transferencia recibida" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].descripcion, "Transferencia recibida");
});

test("no incluye descripcion si está vacía", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Descripción": "" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].descripcion, undefined);
});

test("incluye asuntoOficial si tiene valor", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Asunto Oficial": "Pago mensual" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].asuntoOficial, "Pago mensual");
});

test("no incluye asuntoOficial si está vacío", (t) => {
  const rows: RowExcel[] = [
    { Fecha: "04/01/2026", Asunto: "Sueldo", Crédito: 50000, "Asunto Oficial": "" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].asuntoOficial, undefined);
});

test("incluye solo los campos opcionales que tienen valor", (t) => {
  const rows: RowExcel[] = [
    {
      Fecha:                   "04/01/2026",
      Asunto:                  "Sueldo",
      Crédito:                 50000,
      "Número de documento":   "00123456",
      "Descripción":           "",
      "Asunto Oficial":        "Pago mensual",
    },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].nroDocumento, "00123456");
  t.is(result[0].descripcion, undefined);
  t.is(result[0].asuntoOficial, "Pago mensual");
});

test("no incluye ningún campo opcional si todos están vacíos", (t) => {
  const rows: RowExcel[] = [
    {
      Fecha:                   "04/01/2026",
      Asunto:                  "Sueldo",
      Crédito:                 50000,
      "Número de documento":   "",
      "Descripción":           "",
      "Asunto Oficial":        "",
    },
  ];

  const result = mapearMovimientos(rows);
  t.false("nroDocumento" in result[0]);
  t.false("descripcion" in result[0]);
  t.false("asuntoOficial" in result[0]);
});