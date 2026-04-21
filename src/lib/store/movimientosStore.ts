import type { Movimiento } from "@/types";

// ─── Store global ─────────────────────────────────────────────────────────────

/**
 * Extiende el tipo de `globalThis` para tipar el store.
 * Esto es necesario para que TypeScript no se queje al acceder
 * a una propiedad que no existe en el tipo base.
 */
declare global {
  // eslint-disable-next-line no-var
  var __movimientosStore: Map<string, Movimiento[]> | undefined;
}

/**
 * Store en memoria que persiste en `globalThis` para sobrevivir
 * las recargas de módulos de Next.js en desarrollo (Fast Refresh).
 *
 * En producción el comportamiento es el mismo: el Map vive mientras
 * el proceso de Node.js esté corriendo.
 *
 * La clave es el nombre de la hoja del Excel.
 * El valor es el array de movimientos parseados de esa hoja.
 *
 * @example
 * {
 *   "Cuenta Corriente": [{ dia: "2026-04-01", ... }],
 *   "Caja de Ahorro":   [{ dia: "2026-04-01", ... }],
 * }
 */
const store: Map<string, Movimiento[]> =
  globalThis.__movimientosStore ?? new Map<string, Movimiento[]>();

// Guarda la referencia en globalThis para que sobreviva recargas
if (!globalThis.__movimientosStore) {
  globalThis.__movimientosStore = store;
}

// ─── API del store ────────────────────────────────────────────────────────────

/**
 * Guarda los movimientos de una hoja en el store.
 * Si la hoja ya existe, sobreescribe los datos.
 *
 * @param hoja - Nombre de la hoja del Excel.
 * @param movimientos - Movimientos parseados de esa hoja.
 */
export const setMovimientos = (hoja: string, movimientos: Movimiento[]): void => {
  store.set(hoja, movimientos);
};

/**
 * Obtiene los movimientos de una hoja del store.
 * Devuelve `null` si la hoja no existe.
 *
 * @param hoja - Nombre de la hoja del Excel.
 */
export const getMovimientos = (hoja: string): Movimiento[] | null => {
  return store.get(hoja) ?? null;
};

/**
 * Devuelve los nombres de todas las hojas disponibles en el store.
 *
 * @returns Array de nombres de hojas en el orden en que fueron cargadas.
 */
export const getHojas = (): string[] => {
  return Array.from(store.keys());
};

/**
 * Limpia todas las hojas del store.
 * Se llama cuando el usuario quita el archivo desde la homepage.
 */
export const clearStore = (): void => {
  store.clear();
};