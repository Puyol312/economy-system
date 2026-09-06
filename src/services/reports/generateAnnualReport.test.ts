import test from "ava";

import { generarReporteAnual } from "./generateAnnualReport";

import type { Movimiento } from "@/types";

const movimientos: Movimiento[] = [
  {
    dia: "2026-01-05",
    concepto: "Sueldo",
    monto: 50000,
    tipo: "credito",
  },
  {
    dia: "2026-01-10",
    concepto: "Alquiler",
    monto: 20000,
    tipo: "debito",
  },
  {
    dia: "2026-01-15",
    concepto: "Supermercado",
    monto: 8000,
    tipo: "debito",
  },
  {
    dia: "2026-02-03",
    concepto: "Sueldo",
    monto: 50000,
    tipo: "credito",
  },
  {
    dia: "2026-02-08",
    concepto: "Restaurante",
    monto: 6000,
    tipo: "debito",
  },
  {
    dia: "2026-03-01",
    concepto: "Sueldo",
    monto: 50000,
    tipo: "credito",
  },
  {
    dia: "2026-03-15",
    concepto: "Gym",
    monto: 3000,
    tipo: "debito",
  },
];

test("generarReporteAnual - debería generar correctamente el reporte anual", (t) => {
  const resultado = generarReporteAnual(movimientos);

  t.is(resultado.totalCreditos, 150000);
  t.is(resultado.totalDebitos, 37000);
  t.is(resultado.balanceAnual, 113000);

  t.is(typeof resultado.saldoAcumulado, "object");
  t.is(typeof resultado.balancePorMes, "object");
  t.is(typeof resultado.creditosPorMes, "object");
  t.is(typeof resultado.debitosPorMes, "object");
  t.is(typeof resultado.mejorMes, "string");
});

test("generarReporteAnual - debería devolver un reporte vacío cuando no hay movimientos", (t) => {
  const resultado = generarReporteAnual([]);

  t.deepEqual(resultado.balancePorMes, {});
  t.deepEqual(resultado.saldoAcumulado, {});
  t.deepEqual(resultado.creditosPorMes, {});
  t.deepEqual(resultado.debitosPorMes, {});

  t.is(resultado.totalCreditos, 0);
  t.is(resultado.totalDebitos, 0);
  t.is(resultado.balanceAnual, 0);
  t.is(resultado.mejorMes, "");
});
