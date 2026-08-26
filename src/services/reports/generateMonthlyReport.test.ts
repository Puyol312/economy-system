import test from "ava";

import { generarReporteMensual } from "./generateMonthlyReport";

import type { Movimiento } from "@/types";

const movimientos: Movimiento[] = [
	// Enero
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

	// Febrero
	{
		dia: "2026-02-03",
		concepto: "Sueldo",
		monto: 60000,
		tipo: "credito",
	},
	{
		dia: "2026-02-08",
		concepto: "Alquiler",
		monto: 20000,
		tipo: "debito",
	},
	{
		dia: "2026-02-15",
		concepto: "Restaurante",
		monto: 10000,
		tipo: "debito",
	},
];

test("generarReporteMensual - debería generar correctamente el primer mes", (t) => {
	const resultado = generarReporteMensual(movimientos);

	t.truthy(resultado);

	if (!resultado) return;

	t.deepEqual(resultado.meses, ["2026-01", "2026-02"]);

	t.is(resultado.mes, "2026-01");

	t.is(resultado.totalCreditos, 50000);
	t.is(resultado.totalDebitos, 28000);
	t.is(resultado.balanceMes, 22000);

	t.is(resultado.saldoAlCierre, 22000);

	t.is(resultado.movimientosMes.length, 3);

	t.deepEqual(resultado.comparacion, {
		mesAnterior: null,
		totalCreditosAnterior: null,
		totalDebitosAnterior: null,
		balanceMesAnterior: null,
		variacionCreditos: null,
		variacionDebitos: null,
		variacionBalance: null,
	});
});

test("generarReporteMensual - debería seleccionar el mes indicado y compararlo con el anterior", (t) => {
	const resultado = generarReporteMensual(movimientos, "2026-02");

	t.truthy(resultado);

	if (!resultado) return;

	t.is(resultado.mes, "2026-02");

	t.is(resultado.totalCreditos, 60000);
	t.is(resultado.totalDebitos, 30000);
	t.is(resultado.balanceMes, 30000);

	t.is(resultado.saldoAlCierre, 52000);

	t.is(resultado.movimientosMes.length, 3);

	t.deepEqual(resultado.comparacion, {
		mesAnterior: "2026-01",

		totalCreditosAnterior: 50000,
		totalDebitosAnterior: 28000,
		balanceMesAnterior: 22000,

		variacionCreditos: 20,
		variacionDebitos:
			((30000 - 28000) / Math.abs(28000)) * 100,
		variacionBalance:
			((30000 - 22000) / Math.abs(22000)) * 100,
	});
});

test("generarReporteMensual - debería devolver null cuando no hay movimientos", (t) => {
	const resultado = generarReporteMensual([]);

	t.is(resultado, null);
});