/**
 * redondearMonto
 *
 * Redondea un monto a 2 decimales para eliminar el ruido de
 * punto flotante que introduce sumar/restar `number` en JS
 * (ej. 31.55 + 67.95 puede dar 99.49999999999999 en vez de 99.5).
 *
 * Se usa al final de toda función de `calculations/*` que suma
 * montos, para que el resultado sea el valor matemáticamente
 * correcto y no arrastre ese ruido hasta el redondeo de display
 * en `formatearMoneda`.
 *
 * NOTA: esto es un parche, no la solución de fondo. La solución
 * de fondo es trabajar en centavos (enteros) en vez de floats en
 * toda la cadena de cálculo — ver TICKET-money-integer-cents.md.
 *
 * @example
 * redondearMonto(31.55 + 67.95); // 99.5 (en vez de 99.49999999999999)
 */
export const redondearMonto = (valor: number): number =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

export const redondearTotales = (
  totales: Record<string, number>,
): Record<string, number> => {
  const resultado: Record<string, number> = {};
  for (const clave in totales) {
    resultado[clave] = redondearMonto(totales[clave]);
  }
  return resultado;
};
