import test from "ava";
import { filtrarPorConceptosExcluidos } from "./filtrarMovimientos";
import type { Movimiento } from "@/types";

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  { dia: "2026-04-02", concepto: "Ahorros", monto: 5000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Alquiler", monto: 18000, tipo: "debito" },
  { dia: "2026-04-06", concepto: "Ahorros", monto: 10000, tipo: "debito" },
];

test("sin conceptos excluidos, devuelve todos los movimientos", (t) => {
  const resultado = filtrarPorConceptosExcluidos(movimientos, new Set(), new Set());
  t.is(resultado.length, 4);
});

test("excluye solo el tipo indicado, no ambos", (t) => {
  const resultado = filtrarPorConceptosExcluidos(
    movimientos,
    new Set(),
    new Set(["Ahorros"]),
  );

  // El débito "Ahorros" se excluye, pero el crédito "Ahorros" queda.
  t.is(resultado.length, 3);
  t.true(resultado.some((m) => m.concepto === "Ahorros" && m.tipo === "credito"));
  t.false(resultado.some((m) => m.concepto === "Ahorros" && m.tipo === "debito"));
});

test("un mismo nombre de concepto puede excluirse de ambos tipos a la vez", (t) => {
  const resultado = filtrarPorConceptosExcluidos(
    movimientos,
    new Set(["Ahorros"]),
    new Set(["Ahorros"]),
  );

  t.is(resultado.length, 2);
  t.false(resultado.some((m) => m.concepto === "Ahorros"));
});

test("no afecta movimientos de otros conceptos", (t) => {
  const resultado = filtrarPorConceptosExcluidos(
    movimientos,
    new Set(),
    new Set(["Alquiler"]),
  );

  t.is(resultado.length, 3);
  t.true(resultado.some((m) => m.concepto === "Sueldo"));
  t.true(resultado.some((m) => m.concepto === "Ahorros" && m.tipo === "credito"));
  t.true(resultado.some((m) => m.concepto === "Ahorros" && m.tipo === "debito"));
});

test("array vacío devuelve array vacío", (t) => {
  t.deepEqual(filtrarPorConceptosExcluidos([], new Set(["X"]), new Set()), []);
});
