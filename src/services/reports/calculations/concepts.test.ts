import test from "ava";
import type { Movimiento } from "@/types";

import { agruparPorConcepto } from "./concepts";

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  { dia: "2026-04-05", concepto: "Freelance", monto: 10000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Gym", monto: 3000, tipo: "debito" },
];

// ─── agruparPorConcepto ───────────────────────────────────────────────────────
test("agruparPorConcepto — agrupa créditos por concepto ordenados de mayor a menor", (t) => {
  const result = agruparPorConcepto(movimientos, "credito");

  t.is(result.length, 2);
  t.is(result[0][0], "Sueldo");
  t.is(result[0][1], 50000);
  t.is(result[1][0], "Freelance");
  t.is(result[1][1], 10000);
});

test("agruparPorConcepto — agrupa débitos por concepto ordenados de mayor a menor", (t) => {
  const result = agruparPorConcepto(movimientos, "debito");

  t.is(result.length, 3);
  t.is(result[0][0], "Alquiler");
  t.is(result[0][1], 20000);
  t.is(result[1][0], "Supermercado");
  t.is(result[1][1], 8000);
  t.is(result[2][0], "Gym");
  t.is(result[2][1], 3000);
});

test("agruparPorConcepto — acumula el mismo concepto en múltiples días", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Supermercado", monto: 8000, tipo: "debito" },
    { dia: "2026-04-10", concepto: "Supermercado", monto: 5000, tipo: "debito" },
    { dia: "2026-04-20", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  ];

  const result = agruparPorConcepto(movs, "debito");

  t.is(result.length, 2);
  t.is(result[0][0], "Alquiler");
  t.is(result[0][1], 20000);
  t.is(result[1][0], "Supermercado");
  t.is(result[1][1], 13000);
});

test("agruparPorConcepto — devuelve array vacío si no hay movimientos del tipo", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  ];
  const result = agruparPorConcepto(movs, "credito");
  t.deepEqual(result, []);
});

test("agruparPorConcepto — devuelve array vacío con movimientos vacíos", (t) => {
  t.deepEqual(agruparPorConcepto([], "credito"), []);
  t.deepEqual(agruparPorConcepto([], "debito"), []);
});
