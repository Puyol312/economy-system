import test from "ava";

import { parsearFecha, esFechaValida } from "./excelDate";

test("parsearFecha - debería convertir correctamente una fecha con componentes de un solo dígito", (t) => {
  const resultado = parsearFecha("4/1/2026");

  t.is(resultado, "2026-04-01");
});

test("parsearFecha - debería preservar correctamente componentes de dos dígitos", (t) => {
  const resultado = parsearFecha("12/31/2026");

  t.is(resultado, "2026-12-31");
});

test("esFechaValida - debería aceptar fechas con exactamente tres partes no vacías", (t) => {
  t.true(esFechaValida("04/01/2026"));
  t.true(esFechaValida("4/1/2026"));
  t.true(esFechaValida("99/99/2026"));
});

test("esFechaValida - debería rechazar valores que no sean cadenas o tengan partes vacías", (t) => {
  t.false(esFechaValida(""));
  t.false(esFechaValida("04//2026"));
  t.false(esFechaValida("/01/2026"));
  t.false(esFechaValida("04/01/"));
  t.false(esFechaValida("04/01"));
  t.false(esFechaValida("04/01/2026/extra"));
  t.false(esFechaValida(null));
  t.false(esFechaValida(undefined));
  t.false(esFechaValida(123));
  t.false(esFechaValida({}));
  t.false(esFechaValida([]));
});
