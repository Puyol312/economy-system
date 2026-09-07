import { formatearMes } from "@/lib/format";
import styles from "./SelectorMeses.module.css";

export interface SelectorMesesProps {
  meses: string[];
  mesA: string;
  mesB: string;
  onMesAChange: (mes: string) => void;
  onMesBChange: (mes: string) => void;
}

/**
 * SelectorMeses
 *
 * Dos selects para elegir qué dos meses comparar. Cada uno excluye
 * de sus opciones el mes ya elegido en el otro, para que no se
 * pueda comparar un mes contra sí mismo.
 */
export default function SelectorMeses({
  meses,
  mesA,
  mesB,
  onMesAChange,
  onMesBChange,
}: SelectorMesesProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.selectGroup}>
        <label className={styles.label} htmlFor="mes-a">
          Mes A
        </label>
        <select
          id="mes-a"
          className={styles.select}
          value={mesA}
          onChange={(e) => onMesAChange(e.target.value)}
        >
          {meses
            .filter((mes) => mes !== mesB)
            .map((mes) => (
              <option key={mes} value={mes}>
                {formatearMes(mes)}
              </option>
            ))}
        </select>
      </div>

      <span className={styles.vs}>vs</span>

      <div className={styles.selectGroup}>
        <label className={styles.label} htmlFor="mes-b">
          Mes B
        </label>
        <select
          id="mes-b"
          className={styles.select}
          value={mesB}
          onChange={(e) => onMesBChange(e.target.value)}
        >
          {meses
            .filter((mes) => mes !== mesA)
            .map((mes) => (
              <option key={mes} value={mes}>
                {formatearMes(mes)}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
