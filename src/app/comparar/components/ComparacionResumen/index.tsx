import { formatearMes, formatearMoneda } from "@/lib/format";
import { calcularVariacion } from "@/services/reports/calculations/variacion";
import styles from "./ComparacionResumen.module.css";

export interface ComparacionResumenProps {
  mesA: string;
  mesB: string;
  totalCreditosA: number;
  totalCreditosB: number;
  totalDebitosA: number;
  totalDebitosB: number;
  balanceA: number;
  balanceB: number;
}

interface FilaProps {
  label: string;
  valorA: number;
  valorB: number;
  colorClass: string;
  /** Si subir es una mala noticia (ej. débitos), invierte los colores de la variación. */
  subirEsNegativo?: boolean;
}

function Fila({ label, valorA, valorB, colorClass, subirEsNegativo }: FilaProps) {
  const variacion = calcularVariacion(valorA, valorB);
  const esFavorable =
    variacion === null || variacion === 0
      ? null
      : subirEsNegativo
        ? variacion < 0
        : variacion > 0;

  return (
    <div className={styles.fila}>
      <span className={styles.filaLabel}>{label}</span>
      <span className={`${styles.filaValor} ${colorClass}`}>{formatearMoneda(valorA)}</span>
      <span className={`${styles.filaValor} ${colorClass}`}>{formatearMoneda(valorB)}</span>
      <span
        className={`${styles.variacion} ${
          esFavorable === null ? "" : esFavorable ? styles.favorable : styles.desfavorable
        }`}
      >
        {variacion === null
          ? "—"
          : `${variacion > 0 ? "+" : ""}${variacion.toFixed(1)}%`}
      </span>
    </div>
  );
}

/**
 * ComparacionResumen
 *
 * Tabla comparativa de créditos, débitos y balance entre dos meses,
 * con la variación porcentual de A hacia B. Para débitos, subir se
 * marca como desfavorable (rojo) en vez de favorable, ya que un
 * aumento de gastos no es una buena noticia aunque el número suba.
 */
export default function ComparacionResumen({
  mesA,
  mesB,
  totalCreditosA,
  totalCreditosB,
  totalDebitosA,
  totalDebitosB,
  balanceA,
  balanceB,
}: ComparacionResumenProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerLabel} />
        <span className={styles.headerMes}>{formatearMes(mesA)}</span>
        <span className={styles.headerMes}>{formatearMes(mesB)}</span>
        <span className={styles.headerLabel}>Variación</span>
      </div>

      <Fila
        label="Créditos"
        valorA={totalCreditosA}
        valorB={totalCreditosB}
        colorClass={styles.credito}
      />
      <Fila
        label="Débitos"
        valorA={totalDebitosA}
        valorB={totalDebitosB}
        colorClass={styles.debito}
        subirEsNegativo
      />
      <Fila label="Balance" valorA={balanceA} valorB={balanceB} colorClass={styles.balance} />
    </div>
  );
}
