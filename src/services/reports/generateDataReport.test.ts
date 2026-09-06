import test from "ava";

import { generarReporteDatos } from "./generateDataReport";

import type { Movimiento } from "@/types";

test("generarReporteDatos - debería agrupar los movimientos por mes", (t) => {
  const movimientos: Movimiento[] = [
    {
      dia: "2026-01-10",
      concepto: "Alquiler",
      monto: 20000,
      tipo: "debito",
    },
    {
      dia: "2026-02-05",
      concepto: "Sueldo",
      monto: 50000,
      tipo: "credito",
    },
    {
      dia: "2026-01-05",
      concepto: "Sueldo",
      monto: 50000,
      tipo: "credito",
    },
  ];

  const resultado = generarReporteDatos(movimientos);

  t.deepEqual(resultado.meses, ["2026-01", "2026-02"]);

  t.is(resultado.movimientosPorMes["2026-01"].length, 2);
  t.is(resultado.movimientosPorMes["2026-02"].length, 1);
});

test("generarReporteDatos - debería ordenar los movimientos cronológicamente dentro de cada mes", (t) => {
  const movimientos: Movimiento[] = [
    {
      dia: "2026-01-20",
      concepto: "Gym",
      monto: 3000,
      tipo: "debito",
    },
    {
      dia: "2026-01-05",
      concepto: "Sueldo",
      monto: 50000,
      tipo: "credito",
    },
    {
      dia: "2026-01-15",
      concepto: "Supermercado",
      monto: 8000,
      tipo: "debito",
    },
    {
      dia: "2026-01-01",
      concepto: "Alquiler",
      monto: 20000,
      tipo: "debito",
    },
  ];

  const resultado = generarReporteDatos(movimientos);

  const movimientosEnero = resultado.movimientosPorMes["2026-01"];

  t.deepEqual(
    movimientosEnero.map((movimiento) => movimiento.dia),
    ["2026-01-01", "2026-01-05", "2026-01-15", "2026-01-20"],
  );
});

test("generarReporteDatos - debería devolver un reporte vacío cuando no hay movimientos", (t) => {
  const resultado = generarReporteDatos([]);

  t.deepEqual(resultado.meses, []);
  t.deepEqual(resultado.movimientosPorMes, {});
});
