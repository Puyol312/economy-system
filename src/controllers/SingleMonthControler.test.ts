import test from "ava";
import {
  calcularBalance,
  calcularBalancePorDia,
  obtenerTotalesPorDia,
  sumarTotales,
  agruparPorConcepto
} from "./SingleMonthController";
import type { Movimiento } from "@/types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
  { dia: "2026-04-01", concepto: "Alquiler",     monto: 20000, tipo: "debito"  },
  { dia: "2026-04-02", concepto: "Supermercado", monto: 8000,  tipo: "debito"  },
  { dia: "2026-04-05", concepto: "Freelance",    monto: 10000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Gym",          monto: 3000,  tipo: "debito"  },
];

// ─── calcularBalance ──────────────────────────────────────────────────────────

test("calcularBalance — suma créditos y resta débitos correctamente", (t) => {
  const result = calcularBalance(movimientos);
  // 50000 + 10000 - 20000 - 8000 - 3000 = 29000
  t.is(result, 29000);
});

test("calcularBalance — devuelve 0 con array vacío", (t) => {
  t.is(calcularBalance([]), 0);
});

test("calcularBalance — devuelve negativo si débitos superan créditos", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler",     monto: 20000, tipo: "debito"  },
    { dia: "2026-04-01", concepto: "Supermercado", monto: 5000,  tipo: "debito"  },
    { dia: "2026-04-01", concepto: "Sueldo",       monto: 10000, tipo: "credito" },
  ];
  t.is(calcularBalance(movs), -15000);
});

test("calcularBalance — solo créditos devuelve suma positiva", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Sueldo",    monto: 50000, tipo: "credito" },
    { dia: "2026-04-02", concepto: "Freelance", monto: 10000, tipo: "credito" },
  ];
  t.is(calcularBalance(movs), 60000);
});

test("calcularBalance — solo débitos devuelve suma negativa", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler",     monto: 20000, tipo: "debito" },
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000,  tipo: "debito" },
  ];
  t.is(calcularBalance(movs), -28000);
});

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
    { dia: "2026-04-01", concepto: "Sueldo",    monto: 50000, tipo: "credito" },
    { dia: "2026-04-01", concepto: "Freelance", monto: 10000, tipo: "credito" },
  ];
  const result = obtenerTotalesPorDia(movs, "credito");
  t.is(result["2026-04-01"], 60000);
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
    { dia: "2026-04-01", concepto: "Supermercado", monto: 8000,  tipo: "debito" },
    { dia: "2026-04-10", concepto: "Supermercado", monto: 5000,  tipo: "debito" },
    { dia: "2026-04-20", concepto: "Alquiler",     monto: 20000, tipo: "debito" },
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