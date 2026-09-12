import test from "ava";
import { calcularMetricasFiltradas } from "./metricas";
import type { Movimiento } from "@/types";

const movimientos: Movimiento[] = [
  { dia: "2026-04-01", concepto: "Sueldo", monto: 50000, tipo: "credito" },
  { dia: "2026-04-02", concepto: "Ahorros", monto: 5000, tipo: "credito" },
  { dia: "2026-04-05", concepto: "Alquiler", monto: 18000, tipo: "debito" },
  { dia: "2026-04-06", concepto: "Ahorros", monto: 10000, tipo: "debito" },
];

test("sin exclusiones, calcula sobre todos los movimientos", (t) => {
  const resultado = calcularMetricasFiltradas(movimientos, new Set(), new Set());

  t.is(resultado.totalCreditos, 55000);
  t.is(resultado.totalDebitos, 28000);
  t.is(resultado.balanceMes, 27000);
  t.is(resultado.creditosPorConcepto.length, 2);
  t.is(resultado.debitosPorConcepto.length, 2);
});

test("excluir un concepto de débitos lo saca del total pero no toca créditos", (t) => {
  const resultado = calcularMetricasFiltradas(
    movimientos,
    new Set(),
    new Set(["Ahorros"]),
  );

  t.is(resultado.totalCreditos, 55000);
  t.is(resultado.totalDebitos, 18000);
  t.is(resultado.balanceMes, 37000);
  t.is(resultado.debitosPorConcepto.length, 1);
});

test("balancePorDia y totales por día también reflejan la exclusión", (t) => {
  const resultado = calcularMetricasFiltradas(
    movimientos,
    new Set(["Ahorros"]),
    new Set(),
  );

  t.deepEqual(resultado.creditosPorDia, { "2026-04-01": 50000 });
  t.false("2026-04-02" in resultado.balancePorDia);
});

test("array vacío de movimientos da métricas en cero", (t) => {
  const resultado = calcularMetricasFiltradas([], new Set(), new Set());

  t.is(resultado.totalCreditos, 0);
  t.is(resultado.totalDebitos, 0);
  t.is(resultado.balanceMes, 0);
  t.deepEqual(resultado.creditosPorConcepto, []);
  t.deepEqual(resultado.debitosPorConcepto, []);
});
