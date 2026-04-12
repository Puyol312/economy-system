import styles from "./ConceptosTable.module.css";

/**
 * ConceptosTableProps
 */
export interface ConceptosTableProps {
  /**
   * Créditos agrupados por concepto, ordenados de mayor a menor.
   * Proviene de `agruparPorConcepto(movimientosMes, "credito")`.
   * @example [["Sueldo", 50000], ["Freelance", 10000]]
   */
  creditos: [string, number][];

  /**
   * Débitos agrupados por concepto, ordenados de mayor a menor.
   * Proviene de `agruparPorConcepto(movimientosMes, "debito")`.
   * @example [["Alquiler", 18000], ["Supermercado", 8000]]
   */
  debitos: [string, number][];
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
 * TablaConceptos
 *
 * Tabla individual de conceptos para un tipo de movimiento.
 * Muestra título, encabezados y filas con numeración.
 * Si no hay datos muestra un mensaje vacío.
 */
function TablaConceptos({
  titulo,
  datos,
  colorClass,
  emptyMessage,
}: {
  titulo: string;
  datos: [string, number][];
  colorClass: string;
  emptyMessage: string;
}) {
  return (
    <div className={styles.tableWrapper}>
      <p className={`${styles.tableTitle} ${colorClass}`}>{titulo}</p>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.thNum}>#</th>
            <th className={styles.thConcepto}>Concepto</th>
            <th className={styles.thMonto}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={3} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            datos.map(([concepto, monto], i) => (
              <tr key={concepto} className={styles.row}>
                <td className={styles.tdNum}>{i + 1}</td>
                <td className={styles.tdConcepto}>{concepto}</td>
                <td className={`${styles.tdMonto} ${colorClass}`}>
                  {formatearMoneda(monto)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * ConceptosTable
 *
 * Tabla doble que muestra los conceptos de créditos y débitos
 * del mes seleccionado, ordenados de mayor a menor monto.
 *
 * Cada tabla es independiente: si una no tiene datos muestra
 * su propio mensaje vacío sin afectar a la otra.
 *
 * @example
 * ```tsx
 * // app/mensual/page.tsx
 * const creditos = agruparPorConcepto(movimientosMes, "credito");
 * const debitos  = agruparPorConcepto(movimientosMes, "debito");
 *
 * <ConceptosTable creditos={creditos} debitos={debitos} />
 * ```
 */
export default function ConceptosTable({
  creditos,
  debitos,
}: ConceptosTableProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Conceptos del mes</p>

      <div className={styles.tables}>
        <TablaConceptos
          titulo="Créditos"
          datos={creditos}
          colorClass={styles.credito}
          emptyMessage="Sin créditos este mes"
        />

        <div className={styles.divider} />

        <TablaConceptos
          titulo="Débitos"
          datos={debitos}
          colorClass={styles.debito}
          emptyMessage="Sin débitos este mes"
        />
      </div>
    </div>
  );
}