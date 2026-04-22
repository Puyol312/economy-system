import test from "ava";
import {
  calcularBalancePorMes,
  obtenerTotalesPorMes,
  obtenerAcumulado,
  agruparMovimientosPorMes,
} from "./MultiMonthController";
import type { Movimiento } from "@/types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const movimientos: Movimiento[] = [
  { dia: "2026-01-05", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
  { dia: "2026-01-10", concepto: "Alquiler",     monto: 20000, tipo: "debito"  },
  { dia: "2026-01-15", concepto: "Supermercado", monto: 8000,  tipo: "debito"  },
  { dia: "2026-02-03", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
  { dia: "2026-02-08", concepto: "Restaurante",  monto: 6000,  tipo: "debito"  },
  { dia: "2026-03-01", concepto: "Sueldo",       monto: 50000, tipo: "credito" },
  { dia: "2026-03-15", concepto: "Gym",          monto: 3000,  tipo: "debito"  },
];

// ─── agruparMovimientosPorMes ─────────────────────────────────────────────────

test("agruparMovimientosPorMes — genera las claves de mes correctamente", (t) => {
  const result = agruparMovimientosPorMes(movimientos);
  t.deepEqual(Object.keys(result).sort(), ["2026-01", "2026-02", "2026-03"]);
});

test("agruparMovimientosPorMes — agrupa la cantidad correcta de movimientos por mes", (t) => {
  const result = agruparMovimientosPorMes(movimientos);
  t.is(result["2026-01"].length, 3);
  t.is(result["2026-02"].length, 2);
  t.is(result["2026-03"].length, 2);
});

test("agruparMovimientosPorMes — no pierde movimientos del último día del mes anterior", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-02-28", concepto: "Pago",  monto: 5000,  tipo: "debito"  },
    { dia: "2026-03-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  ];

  const result = agruparMovimientosPorMes(movs);

  t.truthy(result["2026-02"]);
  t.truthy(result["2026-03"]);
  t.is(result["2026-02"].length, 1);
  t.is(result["2026-03"].length, 1);
});

test("agruparMovimientosPorMes — el primer día del mes cae en el mes correcto", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-03-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  ];

  const result = agruparMovimientosPorMes(movs);

  t.truthy(result["2026-03"]);
  t.falsy(result["2026-02"]);
});

test("agruparMovimientosPorMes — devuelve objeto vacío con array vacío", (t) => {
  t.deepEqual(agruparMovimientosPorMes([]), {});
});

// ─── calcularBalancePorMes ────────────────────────────────────────────────────

test("calcularBalancePorMes — calcula el balance neto por mes", (t) => {
  const result = calcularBalancePorMes(movimientos);

  // enero: 50000 - 20000 - 8000 = 22000
  // febrero: 50000 - 6000 = 44000
  // marzo: 50000 - 3000 = 47000
  t.is(result["2026-01"], 22000);
  t.is(result["2026-02"], 44000);
  t.is(result["2026-03"], 47000);
});

test("calcularBalancePorMes — genera las claves de los tres meses", (t) => {
  const result = calcularBalancePorMes(movimientos);
  t.deepEqual(Object.keys(result).sort(), ["2026-01", "2026-02", "2026-03"]);
});

test("calcularBalancePorMes — mes con balance negativo", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler",     monto: 20000, tipo: "debito" },
    { dia: "2026-04-02", concepto: "Supermercado", monto: 8000,  tipo: "debito" },
    { dia: "2026-04-03", concepto: "Sueldo",       monto: 10000, tipo: "credito" },
  ];

  const result = calcularBalancePorMes(movs);
  t.is(result["2026-04"], -18000);
});

test("calcularBalancePorMes — devuelve objeto vacío con array vacío", (t) => {
  t.deepEqual(calcularBalancePorMes([]), {});
});

// ─── obtenerTotalesPorMes ─────────────────────────────────────────────────────

test("obtenerTotalesPorMes — suma créditos por mes correctamente", (t) => {
  const result = obtenerTotalesPorMes(movimientos, "credito");

  t.is(result["2026-01"], 50000);
  t.is(result["2026-02"], 50000);
  t.is(result["2026-03"], 50000);
});

test("obtenerTotalesPorMes — suma débitos por mes correctamente", (t) => {
  const result = obtenerTotalesPorMes(movimientos, "debito");

  // enero: 20000 + 8000 = 28000
  // febrero: 6000
  // marzo: 3000
  t.is(result["2026-01"], 28000);
  t.is(result["2026-02"], 6000);
  t.is(result["2026-03"], 3000);
});

test("obtenerTotalesPorMes — mes sin movimientos del tipo no aparece en el resultado", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Alquiler", monto: 20000, tipo: "debito" },
  ];

  const result = obtenerTotalesPorMes(movs, "credito");
  t.falsy(result["2026-04"]);
});

test("obtenerTotalesPorMes — acumula múltiples créditos en el mismo mes", (t) => {
  const movs: Movimiento[] = [
    { dia: "2026-04-01", concepto: "Sueldo",    monto: 50000, tipo: "credito" },
    { dia: "2026-04-15", concepto: "Freelance", monto: 10000, tipo: "credito" },
  ];

  const result = obtenerTotalesPorMes(movs, "credito");
  t.is(result["2026-04"], 60000);
});

test("obtenerTotalesPorMes — devuelve objeto vacío con array vacío", (t) => {
  t.deepEqual(obtenerTotalesPorMes([], "credito"), {});
  t.deepEqual(obtenerTotalesPorMes([], "debito"), {});
});

// ─── obtenerAcumulado ─────────────────────────────────────────────────────────

test("obtenerAcumulado — suma todos los valores del objeto", (t) => {
  const totales = { "2026-01": 22000, "2026-02": 44000, "2026-03": 47000 };
  t.is(obtenerAcumulado(totales), 113000);
});

test("obtenerAcumulado — devuelve 0 con objeto vacío", (t) => {
  t.is(obtenerAcumulado({}), 0);
});

test("obtenerAcumulado — funciona con valores negativos", (t) => {
  const totales = { "2026-01": 22000, "2026-02": -5000 };
  t.is(obtenerAcumulado(totales), 17000);
});

test("obtenerAcumulado — resultado correcto con balance real", (t) => {
  const balancePorMes = calcularBalancePorMes(movimientos);
  const acumulado = obtenerAcumulado(balancePorMes);

  // 22000 + 44000 + 47000 = 113000
  t.is(acumulado, 113000);
});