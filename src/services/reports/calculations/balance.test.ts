import test from "ava";

import type { Movimiento } from "@/types";
import { calcularBalance, sumarTotales } from "./balance";

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  { dia: "2026-04-05", concepto: "Freelance", monto: 10000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Gym", monto: 3000, tipo: "debito" },
];

// ─── calcularBalance ──────────────────────────────────────────────────────────
test("calcularBalance — suma créditos y resta débitos correctamente", (t) => {
  const result = calcularBalance(movimientos);
  t.is(result, 29000);
});

test("calcularBalance — devuelve 0 con array vacío", (t) => {
  t.is(calcularBalance([]), 0);
});

test("calcularBalance — devuelve negativo si débitos superan créditos", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
    { dia: "2026-04-01", concepto: "Supermercado", monto: 5000, tipo: "debito" },
    { dia: "2026-04-01", concepto: "Sueldo", monto: 10000, tipo: "credito" },
  ];
  t.is(calcularBalance(movs), -15000);
});

test("calcularBalance — solo créditos devuelve suma positiva", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
    { dia: "2026-04-02", concepto: "Freelance", monto: 10000, tipo: "credito" },
  ];
  t.is(calcularBalance(movs), 60000);
});

test("calcularBalance — solo débitos devuelve suma negativa", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  ];
  t.is(calcularBalance(movs), -28000);
});

// ─── sumarTotales ─────────────────────────────────────────────────────────────
test("sumarTotales — suma todos los valores del objeto", (t) => {
  const totales = { "2026-04-01": 50000, "2026-04-02": 8000, "2026-04-05": 10000 };
  t.is(sumarTotales(totales), 68000);
});

test("sumarTotales — devuelve 0 con objeto vacío", (t) => {
  t.is(sumarTotales({}), 0);
});

test("sumarTotales — funciona con valores negativos", (t) => {
  const totales = { "2026-04-01": 30000, "2026-04-02": -8000 };
  t.is(sumarTotales(totales), 22000);
});
