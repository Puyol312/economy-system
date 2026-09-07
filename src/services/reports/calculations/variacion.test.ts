import test from "ava";
import { calcularVariacion } from "./variacion";

test("calcularVariacion — sube 20%", (t) => {
  t.is(calcularVariacion(100, 120), 20);
});

test("calcularVariacion — baja 20%", (t) => {
  t.is(calcularVariacion(100, 80), -20);
});

test("calcularVariacion — sin cambio es 0%", (t) => {
  t.is(calcularVariacion(100, 100), 0);
});

test("calcularVariacion — anterior 0 y actual distinto de 0 es null", (t) => {
  t.is(calcularVariacion(0, 50), null);
});

test("calcularVariacion — ambos 0 es 0%", (t) => {
  t.is(calcularVariacion(0, 0), 0);
});

test("calcularVariacion — usa el valor absoluto del anterior si es negativo", (t) => {
  // anterior=-100, actual=-50: mejoró 50 sobre una base de 100 -> +50%
  t.is(calcularVariacion(-100, -50), 50);
});
