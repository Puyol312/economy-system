import test from "ava";
import type { Movimiento } from "@/types";
import { calcularBalancePorDia, obtenerTotalesPorDia } from "./daily";

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  { dia: "2026-04-02", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  { dia: "2026-04-05", concepto: "Freelance", monto: 10000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Gym", monto: 3000, tipo: "debito" },
];

// ─── calcularBalancePorDia ────────────────────────────────────────────────────
test("calcularBalancePorDia — agrupa y calcula balance por día", (t) => {
  const result = calcularBalancePorDia(movimientos);

  // dia 01: 50000 - 20000 = 30000
  // dia 02: -8000
  // dia 05: 10000 - 3000 = 7000
  t.is(result["2026-04-01"], 30000);
  t.is(result["2026-04-02"], -8000);
  t.is(result["2026-04-05"], 7000);
});

test("calcularBalancePorDia — devuelve objeto vacío con array vacío", (t) => {
  const result = calcularBalancePorDia([]);
  t.deepEqual(result, {});
});

test("calcularBalancePorDia — día con solo débito es negativo", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Supermercado", monto: 8000, tipo: "debito" },
  ];
  const result = calcularBalancePorDia(movs);
  t.is(result["2026-04-01"], -8000);
});

test("calcularBalancePorDia — no mezcla días distintos", (t) => {
  const result = calcularBalancePorDia(movimientos);
  t.is(Object.keys(result).length, 3);
});

// ─── obtenerTotalesPorDia ─────────────────────────────────────────────────────
test("obtenerTotalesPorDia — suma créditos por día correctamente", (t) => {
  const result = obtenerTotalesPorDia(movimientos, "credito");

  t.is(result["2026-04-01"], 50000);
  t.is(result["2026-04-05"], 10000);
  t.falsy(result["2026-04-02"]); // no hay créditos ese día
});

test("obtenerTotalesPorDia — suma débitos por día correctamente", (t) => {
  const result = obtenerTotalesPorDia(movimientos, "debito");

  t.is(result["2026-04-01"], 20000);
  t.is(result["2026-04-02"], 8000);
  t.is(result["2026-04-05"], 3000);
});

test("obtenerTotalesPorDia — devuelve objeto vacío si no hay movimientos del tipo", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  ];
  const result = obtenerTotalesPorDia(movs, "credito");
  t.deepEqual(result, {});
});

test("obtenerTotalesPorDia — acumula múltiples movimientos del mismo tipo en el mismo día", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
    { dia: "2026-04-01", concepto: "Freelance", monto: 10000, tipo: "credito" },
  ];
  const result = obtenerTotalesPorDia(movs, "credito");
  t.is(result["2026-04-01"], 60000);
});
