"use client";

import styles from "./MesesSidebar.module.css";
import { formatearMes } from "@/lib/format";

/**
 * MesesSidebarProps
 */
export interface MesesSidebarProps {
  /**
   * Lista de meses disponibles en formato "YYYY-MM".
   * Se obtiene con `Object.keys(agruparMovimientosPorMes(data))`.
   * @example ["2026-01", "2026-02", "2026-03"]
   */
  meses: string[];

  /**
   * Mes actualmente seleccionado en formato "YYYY-MM".
   */
  mesActivo: string;

  /**
   * Callback que se ejecuta al seleccionar un mes.
   * @param mes - El mes seleccionado en formato "YYYY-MM".
   */
  onMesChange: (mes: string) => void;
}

/**
 * MesesSidebar
 *
 * Panel lateral con la lista de meses disponibles en el archivo cargado.
 * Permite al usuario seleccionar el mes que quiere analizar.
 *
 * En desktop se muestra como una columna fija a la izquierda.
 * En mobile colapsa a un selector horizontal con scroll.
 *
 * @example
 * ```tsx
 * // app/mensual/page.tsx
 * const meses = Object.keys(agruparMovimientosPorMes(data)).sort();
 * const [mesActivo, setMesActivo] = useState(meses[0]);
 *
 * <MesesSidebar
 *   meses={meses}
 *   mesActivo={mesActivo}
 *   onMesChange={setMesActivo}
 * />
 * ```
 */
export default function MesesSidebar({
  meses,
  mesActivo,
  onMesChange,
}: MesesSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Selector de mes">
      <p className={styles.sidebarTitle}>Meses</p>

      {/* Desktop — lista vertical */}
      <ul className={styles.list}>
        {meses.map((mes) => (
          <li key={mes}>
            <button
              className={`${styles.item} ${mes === mesActivo ? styles.active : ""}`}
              onClick={() => onMesChange(mes)}
              aria-current={mes === mesActivo ? "true" : undefined}
            >
              {formatearMes(mes)}
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile — selector horizontal */}
      <div className={styles.mobileScroll}>
        {meses.map((mes) => (
          <button
            key={mes}
            className={`${styles.mobileItem} ${mes === mesActivo ? styles.mobileActive : ""}`}
            onClick={() => onMesChange(mes)}
          >
            {formatearMes(mes)}
          </button>
        ))}
      </div>
    </aside>
  );
}