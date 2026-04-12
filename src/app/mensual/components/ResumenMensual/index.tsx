import styles from "./ResumenMensual.module.css";

/**
 * ResumenMensualProps
 */
export interface ResumenMensualProps {
  /**
   * Total acumulado de créditos del mes.
   * Proviene de `sumarTotales(obtenerTotalesPorDia(movimientosMes, "credito"))`.
   */
  totalCreditos: number;

  /**
   * Total acumulado de débitos del mes.
   * Proviene de `sumarTotales(obtenerTotalesPorDia(movimientosMes, "debito"))`.
   */
  totalDebitos: number;

  /**
   * Balance neto del mes (créditos - débitos).
   * Proviene de `calcularBalance(movimientosMes)`.
   */
  balanceMes: number;
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
 * ResumenMensual
 *
 * Grilla de 3 tarjetas con los totales del mes seleccionado:
 * - Total créditos
 * - Total débitos
 * - Balance del mes
 *
 * Se ubica debajo de los gráficos en la página `/mensual`.
 *
 * @example
 * ```tsx
 * // app/mensual/page.tsx
 * const movimientosMes = agruparMovimientosPorMes(data)[mesActivo] ?? [];
 *
 * const totalCreditos = sumarTotales(obtenerTotalesPorDia(movimientosMes, "credito"));
 * const totalDebitos  = sumarTotales(obtenerTotalesPorDia(movimientosMes, "debito"));
 * const balanceMes    = calcularBalance(movimientosMes);
 *
 * <ResumenMensual
 *   totalCreditos={totalCreditos}
 *   totalDebitos={totalDebitos}
 *   balanceMes={balanceMes}
 * />
 * ```
 */
export default function ResumenMensual({
  totalCreditos,
  totalDebitos,
  balanceMes,
}: ResumenMensualProps) {
  const balancePositivo = balanceMes >= 0;

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
      label: "Balance del mes",
      value: formatearMoneda(balanceMes),
      colorClass: balancePositivo ? styles.credito : styles.debito,
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