import test from "ava";
import { formatearMoneda } from "./format";

const NBSP = "\u00a0";

test("formatearMoneda — peso entero no muestra decimales", (t) => {
  t.is(formatearMoneda(100), `$${NBSP}100`);
});

test("formatearMoneda — monto con centavos muestra 2 decimales", (t) => {
  t.is(formatearMoneda(99.5), `$${NBSP}99,50`);
});

test("formatearMoneda — monto con 2 decimales exactos", (t) => {
  t.is(formatearMoneda(50.05), `$${NBSP}50,05`);
});

test("formatearMoneda — suma exacta sin decimales no muestra centavos", (t) => {
  t.is(formatearMoneda(99.5 + 99.5), `$${NBSP}199`);
});

test("formatearMoneda — tolera ruido de punto flotante cercano a un entero", (t) => {
  t.is(formatearMoneda(100.00000000001), `$${NBSP}100`);
});

test("formatearMoneda — funciona con negativos", (t) => {
  t.is(formatearMoneda(-250.75), `-$${NBSP}250,75`);
});

test("formatearMoneda — cero no muestra decimales", (t) => {
  t.is(formatearMoneda(0), `$${NBSP}0`);
});