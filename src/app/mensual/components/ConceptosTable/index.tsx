import { useState } from "react";
import type { Movimiento, TipoMovimiento } from "@/types";
import ConceptoModal from "../ConceptoModal";
import styles from "./ConceptosTable.module.css";
import { formatearMoneda } from "@/lib/format";

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

  /** Movimientos del mes seleccionado, sin agrupar. */
  movimientosMes: Movimiento[];

  /** Devuelve si un concepto está excluido de los totales mostrados. */
  estaExcluido: (concepto: string, tipo: TipoMovimiento) => boolean;

  /** Tilda/destilda un concepto de los totales mostrados en pantalla. */
  onToggleConcepto: (concepto: string, tipo: TipoMovimiento) => void;
}

/**
 * TablaConceptos
 *
 * Tabla individual de conceptos para un tipo de movimiento.
 * Cada fila tiene un checkbox: destildarlo excluye ese concepto
 * de los totales, gráficos y balance mostrados en la página
 * (sin borrar ni modificar los datos originales).
 */
function TablaConceptos({
  titulo,
  datos,
  tipo,
  colorClass,
  emptyMessage,
  onConceptoClick,
  estaExcluido,
  onToggleConcepto,
}: {
  titulo: string;
  datos: [string, number][];
  tipo: TipoMovimiento;
  colorClass: string;
  emptyMessage: string;
  onConceptoClick: (concepto: string) => void;
  estaExcluido: (concepto: string, tipo: TipoMovimiento) => boolean;
  onToggleConcepto: (concepto: string, tipo: TipoMovimiento) => void;
}) {
  return (
    <div className={styles.tableWrapper}>
      <p className={`${styles.tableTitle} ${colorClass}`}>{titulo}</p>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.thCheckbox} />
            <th className={styles.thNum}>#</th>
            <th className={styles.thConcepto}>Concepto</th>
            <th className={styles.thMonto}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            datos.map(([concepto, monto], i) => {
              const excluido = estaExcluido(concepto, tipo);
              return (
                <tr
                  key={concepto}
                  className={`${styles.row} ${styles.rowClickable} ${
                    excluido ? styles.rowExcluida : ""
                  }`}
                  onClick={() => onConceptoClick(concepto)}
                >
                  <td className={styles.tdCheckbox}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={!excluido}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onToggleConcepto(concepto, tipo)}
                      aria-label={
                        excluido
                          ? `Incluir "${concepto}" en los totales`
                          : `Excluir "${concepto}" de los totales`
                      }
                    />
                  </td>
                  <td className={styles.tdNum}>{i + 1}</td>
                  <td className={styles.tdConcepto}>{concepto}</td>
                  <td className={`${styles.tdMonto} ${colorClass}`}>
                    {formatearMoneda(monto)}
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

/**
 * ConceptosTable
 *
 * Tabla doble que muestra los conceptos de créditos y débitos
 * del mes seleccionado, ordenados de mayor a menor monto.
 *
 * Cada fila tiene un checkbox para excluirla de los totales
 * mostrados en pantalla (total créditos, total débitos, balance
 * del mes y los gráficos). El concepto no desaparece de la tabla,
 * solo se atenúa — así es fácil volver a incluirlo.
 */
export default function ConceptosTable({
  creditos,
  debitos,
  movimientosMes,
  estaExcluido,
  onToggleConcepto,
}: ConceptosTableProps) {
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState<string | null>(null);
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Conceptos del mes</p>

      <div className={styles.tables}>
        <TablaConceptos
          titulo="Créditos"
          datos={creditos}
          tipo="credito"
          colorClass={styles.credito}
          emptyMessage="Sin créditos este mes"
          onConceptoClick={setConceptoSeleccionado}
          estaExcluido={estaExcluido}
          onToggleConcepto={onToggleConcepto}
        />

        <div className={styles.divider} />

        <TablaConceptos
          titulo="Débitos"
          datos={debitos}
          tipo="debito"
          colorClass={styles.debito}
          emptyMessage="Sin débitos este mes"
          onConceptoClick={setConceptoSeleccionado}
          estaExcluido={estaExcluido}
          onToggleConcepto={onToggleConcepto}
        />
      </div>

      <ConceptoModal
        concepto={conceptoSeleccionado}
        movimientosMes={movimientosMes}
        onClose={() => setConceptoSeleccionado(null)}
      />
    </div>
  );
}
