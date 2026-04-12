import styles from "./ResumenAnual.module.css";

/**
 * Datos necesarios para mostrar el resumen anual.
 */
export interface ResumenAnualProps {
  /**
   * Total acumulado de créditos del año.
   * Proviene de `obtenerAcumulado(obtenerTotalesPorMes(data, "credito"))`.
   */
  totalCreditos: number;

  /**
   * Total acumulado de débitos del año.
   * Proviene de `obtenerAcumulado(obtenerTotalesPorMes(data, "debito"))`.
   */
  totalDebitos: number;

  /**
   * Balance neto anual (créditos - débitos).
   * Proviene de `obtenerAcumulado(calcularBalancePorMes(data))`.
   */
  balanceAnual: number;

  /**
   * Mes con el mejor balance del año en formato "YYYY-MM".
   * Se obtiene ordenando `calcularBalancePorMes` y tomando el máximo.
   * @example "2026-04"
   */
  mejorMes: string;
}

/**
 * Formatea un número como moneda local sin decimales.
 * @example 50000 → "$50.000"
 */
const formatearMoneda = (valor: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

/**
 * Convierte un mes en formato "YYYY-MM" a un string legible.
 * @example "2026-04" → "Abril 2026"
 */
const formatearMes = (mes: string): string => {
  const [anio, mm] = mes.split("-");
  const fecha = new Date(Number(anio), Number(mm) - 1, 1);
  return fecha.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
};

/**
 * ResumenAnual
 *
 * Grilla de 4 tarjetas con los totales del año:
 * - Total créditos
 * - Total débitos
 * - Balance anual
 * - Mejor mes
 *
 * Se ubica al final de la página `/anual`, debajo de los gráficos.
 *
 * @example
 * ```tsx
 * // app/anual/page.tsx
 * const creditosPorMes  = obtenerTotalesPorMes(data, "credito");
 * const debitosPorMes   = obtenerTotalesPorMes(data, "debito");
 * const balancePorMes   = calcularBalancePorMes(data);
 *
 * const totalCreditos = obtenerAcumulado(creditosPorMes);
 * const totalDebitos  = obtenerAcumulado(debitosPorMes);
 * const balanceAnual  = obtenerAcumulado(balancePorMes);
 * const mejorMes      = Object.entries(balancePorMes)
 *   .sort(([, a], [, b]) => b - a)[0][0];
 *
 * <ResumenAnual
 *   totalCreditos={totalCreditos}
 *   totalDebitos={totalDebitos}
 *   balanceAnual={balanceAnual}
 *   mejorMes={mejorMes}
 * />
 * ```
 */
export default function ResumenAnual({
  totalCreditos,
  totalDebitos,
  balanceAnual,
  mejorMes,
}: ResumenAnualProps) {
  const balancePositivo = balanceAnual >= 0;

  const tarjetas = [
    {
      label: "Total créditos",
      value: formatearMoneda(totalCreditos),
      colorClass: styles.credito,
    },
    {
      label: "Total débitos",
      value: formatearMoneda(totalDebitos),
      colorClass: styles.debito,
    },
    {
      label: "Balance anual",
      value: formatearMoneda(balanceAnual),
      colorClass: balancePositivo ? styles.credito : styles.debito,
    },
    {
      label: "Mejor mes",
      value: formatearMes(mejorMes),
      colorClass: styles.neutral,
    },
  ];

  return (
    <div className={styles.grid}>
      {tarjetas.map(({ label, value, colorClass }) => (
        <div key={label} className={styles.card}>
          <p className={styles.label}>{label}</p>
          <p className={`${styles.value} ${colorClass}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}