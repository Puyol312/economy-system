/**
 * Calcula la variación porcentual entre un valor anterior y uno actual.
 *
 * Devuelve `null` cuando el valor anterior es 0 y el actual no lo es
 * (no hay una variación porcentual matemáticamente válida — sería
 * "infinito"). Si ambos son 0, la variación es 0.
 *
 * @example
 * calcularVariacion(100, 120); // 20 (subió 20%)
 * calcularVariacion(100, 80);  // -20 (bajó 20%)
 * calcularVariacion(0, 50);    // null
 * calcularVariacion(0, 0);     // 0
 */
export const calcularVariacion = (anterior: number, actual: number): number | null => {
  if (anterior === 0) {
    return actual === 0 ? 0 : null;
  }

  return ((actual - anterior) / Math.abs(anterior)) * 100;
};
