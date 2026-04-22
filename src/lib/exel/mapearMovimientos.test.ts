import test from "ava";
import { mapearMovimientos } from "./mapearMovimientos";
import type { RowExcel } from "@/types";

// ─── Casos base ───────────────────────────────────────────────────────────────

test("mapea una fila con crédito correctamente", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  ]);
});

test("mapea una fila con débito correctamente", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-02", CONCEPTO: "Supermercado", DEBITO: 8000 },
  ];

  const result = mapearMovimientos(rows);

  t.deepEqual(result, [
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  ]);
});

test("mapea múltiples filas con créditos y débitos", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Sueldo",       CREDITO: 50000 },
    { DIA: "2026-04-02", CONCEPTO: "Supermercado", DEBITO: 8000   },
    { DIA: "2026-04-03", CONCEPTO: "Freelance",    CREDITO: 10000 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 3);
  t.is(result[0].tipo, "credito");
  t.is(result[1].tipo, "debito");
  t.is(result[2].tipo, "credito");
});

// ─── Filas inválidas ──────────────────────────────────────────────────────────

test("ignora filas sin crédito ni débito", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Sin monto" },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 0);
});

test("ignora filas con crédito y débito en cero", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Cero", CREDITO: 0, DEBITO: 0 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result.length, 0);
});

test("ignora filas con valores inválidos y procesa las válidas", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Sin monto"  },
    { DIA: "2026-04-02", CONCEPTO: "Sueldo",    CREDITO: 50000 },
    { DIA: "2026-04-03", CONCEPTO: "Otro cero", DEBITO: 0      },
    { DIA: "2026-04-04", CONCEPTO: "Alquiler",  DEBITO: 20000  },
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
    { DIA: "2026-04-01", CONCEPTO: "Sueldo", CREDITO: "50000" as unknown as number },
  ];

  const result = mapearMovimientos(rows);

  t.is(result[0].monto, 50000);
});

test("prioriza crédito sobre débito si ambos son mayores a cero", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Raro", CREDITO: 1000, DEBITO: 500 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result[0].tipo, "credito");
  t.is(result[0].monto, 1000);
});

// ─── Tipos del resultado ──────────────────────────────────────────────────────

test("el tipo del resultado es 'credito' como literal", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Sueldo", CREDITO: 50000 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result[0].tipo, "credito");
});

test("el tipo del resultado es 'debito' como literal", (t) => {
  const rows: RowExcel[] = [
    { DIA: "2026-04-01", CONCEPTO: "Alquiler", DEBITO: 20000 },
  ];

  const result = mapearMovimientos(rows);

  t.is(result[0].tipo, "debito");
});