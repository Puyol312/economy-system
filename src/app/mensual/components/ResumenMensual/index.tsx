import styles from "./ResumenMensual.module.css";

export interface ResumenMensualProps {
  totalCreditos: number;
  totalDebitos:  number;
  balanceMes:    number;
  saldoAlCierre: number;
}

const formatearMoneda = (valor: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

/**
 * ResumenMensual
 *
 * Grilla de 4 tarjetas con los totales del mes seleccionado:
 * - Total créditos
 * - Total débitos
 * - Balance del mes
 * - Saldo acumulado al cierre
 */
export default function ResumenMensual({
  totalCreditos,
  totalDebitos,
  balanceMes,
  saldoAlCierre,
}: ResumenMensualProps) {
  const balancePositivo      = balanceMes    >= 0;
  const saldoAlCierrePositivo = saldoAlCierre >= 0;

  const tarjetas = [
    {
      label:      "Total créditos",
      value:      formatearMoneda(totalCreditos),
      colorClass: styles.credito,
    },
    {
      label:      "Total débitos",
      value:      formatearMoneda(totalDebitos),
      colorClass: styles.debito,
    },
    {
      label:      "Balance del mes",
      value:      formatearMoneda(balanceMes),
      colorClass: balancePositivo ? styles.credito : styles.debito,
    },
    {
      label:      "Saldo al cierre",
      value:      formatearMoneda(saldoAlCierre),
      colorClass: saldoAlCierrePositivo ? styles.acumulado : styles.debito,
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