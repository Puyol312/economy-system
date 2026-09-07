import type { TipoMovimiento } from "@/types";
import { formatearMes, formatearMoneda } from "@/lib/format";
import { calcularVariacion } from "@/services/reports/calculations/variacion";
import styles from "./ComparacionConceptos.module.css";

export interface ComparacionConceptosProps {
  titulo: string;
  mesA: string;
  mesB: string;
  conceptosA: [string, number][];
  conceptosB: [string, number][];
  tipo: TipoMovimiento;
  colorClass: string;
  estaExcluido: (concepto: string, tipo: TipoMovimiento) => boolean;
  onToggleConcepto: (concepto: string, tipo: TipoMovimiento) => void;
}

/**
 * ComparacionConceptos
 *
 * Tabla con la unión de conceptos presentes en cualquiera de los
 * dos meses (un concepto que solo existe en uno de los dos se
 * muestra igual, con "—" del lado que no tiene movimientos).
 *
 * El checkbox de cada fila usa el mismo estado de exclusión que
 * `/mensual` (vía `useExclusionConceptos`): excluir un concepto acá
 * lo saca de los totales de AMBOS meses a la vez, para que la
 * comparación siga siendo consistente entre sí.
 */
export default function ComparacionConceptos({
  titulo,
  mesA,
  mesB,
  conceptosA,
  conceptosB,
  tipo,
  colorClass,
  estaExcluido,
  onToggleConcepto,
}: ComparacionConceptosProps) {
  const mapaA = new Map(conceptosA);
  const mapaB = new Map(conceptosB);

  const conceptos = Array.from(new Set([...mapaA.keys(), ...mapaB.keys()])).sort((a, b) => {
    const totalA = (mapaA.get(a) ?? 0) + (mapaB.get(a) ?? 0);
    const totalB = (mapaA.get(b) ?? 0) + (mapaB.get(b) ?? 0);
    return totalB - totalA;
  });

  return (
    <div className={styles.wrapper}>
      <p className={`${styles.titulo} ${colorClass}`}>{titulo}</p>

      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.thCheckbox} />
            <th className={styles.thConcepto}>Concepto</th>
            <th className={styles.thMonto}>{formatearMes(mesA)}</th>
            <th className={styles.thMonto}>{formatearMes(mesB)}</th>
            <th className={styles.thVariacion}>Variación</th>
          </tr>
        </thead>
        <tbody>
          {conceptos.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Sin movimientos en ninguno de los dos meses
              </td>
            </tr>
          ) : (
            conceptos.map((concepto) => {
              const montoA = mapaA.get(concepto) ?? 0;
              const montoB = mapaB.get(concepto) ?? 0;
              const excluido = estaExcluido(concepto, tipo);
              const variacion = calcularVariacion(montoA, montoB);

              return (
                <tr
                  key={concepto}
                  className={`${styles.row} ${excluido ? styles.rowExcluida : ""}`}
                >
                  <td className={styles.tdCheckbox}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={!excluido}
                      onChange={() => onToggleConcepto(concepto, tipo)}
                      aria-label={
                        excluido
                          ? `Incluir "${concepto}" en la comparación`
                          : `Excluir "${concepto}" de la comparación`
                      }
                    />
                  </td>
                  <td className={styles.tdConcepto}>{concepto}</td>
                  <td className={`${styles.tdMonto} ${colorClass}`}>
                    {mapaA.has(concepto) ? formatearMoneda(montoA) : "—"}
                  </td>
                  <td className={`${styles.tdMonto} ${colorClass}`}>
                    {mapaB.has(concepto) ? formatearMoneda(montoB) : "—"}
                  </td>
                  <td className={styles.tdVariacion}>
                    {variacion === null ? "—" : `${variacion > 0 ? "+" : ""}${variacion.toFixed(1)}%`}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}