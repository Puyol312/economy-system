import test from "ava";
import { mapearMovimientos } from "./mapearMovimientos";
import type { RowExcel } from "@/types";

// ─── Casos base ───────────────────────────────────────────────────────────────

test("mapea una fila con crédito correctamente", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  ]);
});

test("mapea una fila con débito correctamente", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/02/2026", ASUNTO: "Supermercado", DEBITO: 8000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  ]);
});

test("mapea múltiples filas con créditos y débitos", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Sueldo",       CREDITO: 50000 },
    { FECHA: "04/02/2026", ASUNTO: "Supermercado", DEBITO: 8000   },
    { FECHA: "04/03/2026", ASUNTO: "Freelance",    CREDITO: 10000 },
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
    { FECHA: "04/01/2026", ASUNTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-04-01");
});

test("convierte fecha del último día del mes correctamente", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "03/31/2026", ASUNTO: "Pago", DEBITO: 1000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-03-31");
});

test("convierte fecha del primer día del mes correctamente", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "03/01/2026", ASUNTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-03-01");
});

test("convierte correctamente diciembre", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "12/31/2026", ASUNTO: "Cierre", CREDITO: 1000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].dia, "2026-12-31");
});

// ─── Filas inválidas ──────────────────────────────────────────────────────────

test("ignora filas sin crédito ni débito", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Sin monto" },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con crédito y débito en cero", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Cero", CREDITO: 0, DEBITO: 0 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result.length, 0);
});

test("ignora filas con valores inválidos y procesa las válidas", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Sin monto"  },
    { FECHA: "04/02/2026", ASUNTO: "Sueldo",    CREDITO: 50000 },
    { FECHA: "04/03/2026", ASUNTO: "Otro cero", DEBITO: 0      },
    { FECHA: "04/04/2026", ASUNTO: "Alquiler",  DEBITO: 20000  },
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
    { FECHA: "04/01/2026", ASUNTO: "Sueldo", CREDITO: "50000" as unknown as number },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].monto, 50000);
});

test("prioriza crédito sobre débito si ambos son mayores a cero", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Raro", CREDITO: 1000, DEBITO: 500 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "credito");
  t.is(result[0].monto, 1000);
});

// ─── Tipos del resultado ──────────────────────────────────────────────────────

test("el tipo del resultado es 'credito' como literal", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "credito");
});

test("el tipo del resultado es 'debito' como literal", (t) => {
  const rows: RowExcel[] = [
    { FECHA: "04/01/2026", ASUNTO: "Alquiler", DEBITO: 20000 },
  ];

  const result = mapearMovimientos(rows);
  t.is(result[0].tipo, "debito");
});