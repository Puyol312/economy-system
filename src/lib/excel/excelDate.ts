/**
 * parsearFecha
 *
 * Convierte una fecha en formato MM/DD/AAAA al formato AAAA-MM-DD
 * que usan los controladores internamente.
 *
 * @param fecha - Fecha en formato MM/DD/AAAA. Ej: "04/01/2026"
 * @returns Fecha en formato AAAA-MM-DD. Ej: "2026-04-01"
 *
 * @example
 * parsearFecha("04/01/2026") // "2026-04-01"
 * parsearFecha("12/31/2026") // "2026-12-31"
 */
export const parsearFecha = (fecha: string): string => {
  const [mm, dd, aaaa] = fecha.split("/");

  return `${aaaa}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};
/**
 * esFechaValida
 *
 * \Valida que la fecha tenga el formato MM/DD/AAAA y que no este vacia.
 * Si no es una cadena o no tiene el formato correcto, devuelve false.
 *
 * @param fecha - Fecha en formato MM/DD/AAAA. Ej: "04/01/2026"
 * @returns boolean indicando si la fecha es valida o no.
 *
 * @example
 * esFechaValida("04/01/2026") // true
 * esFechaValida("12/31/2026") // true
 * esFechaValida("2026-04-01") // false
 * esFechaValida("")             // false
 * esFechaValida(null)           // false
 * esFechaValida(undefined)      // false
 */
export const esFechaValida = (fecha: unknown): fecha is string => {
  if (typeof fecha !== "string") return false;

  const partes = fecha.split("/");

  return partes.length === 3 && partes.every((parte) => parte.length > 0);
};
