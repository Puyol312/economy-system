"use client";

import { useEffect } from "react";
import type { Movimiento } from "@/types";
import MovimientoCard from "@/components/MovimientoCard";
import styles from "./ConceptoModal.module.css";

/**
 * ConceptoModalProps
 */
export interface ConceptoModalProps {
  /**
   * Concepto seleccionado a mostrar.
   * Si es null el modal no se renderiza.
   */
  concepto: string | null;

  /**
   * Todos los movimientos del mes activo.
   * El modal filtra internamente los que coinciden con el concepto.
   */
  movimientosMes: Movimiento[];

  /**
   * Callback para cerrar el modal.
   */
  onClose: () => void;
}

/**
 * ConceptoModal
 *
 * Modal que muestra todas las rows del mes que coinciden
 * con el concepto seleccionado en `ConceptosTable`.
 *
 * Reutiliza `MovimientoCard` para mostrar cada movimiento.
 * Se cierra con la X o clickeando el overlay.
 * Bloquea el scroll del body mientras está abierto.
 *
 * @example
 * ```tsx
 * <ConceptoModal
 *   concepto={conceptoSeleccionado}
 *   movimientosMes={reporte.movimientosMes}
 *   onClose={() => setConceptoSeleccionado(null)}
 * />
 * ```
 */
export default function ConceptoModal({
  concepto,
  movimientosMes,
  onClose,
}: ConceptoModalProps) {
  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
  if (!concepto) return;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  return () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };
}, [concepto]);

  // Cierra con Escape
  useEffect(() => {
    if (!concepto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [concepto, onClose]);

  if (!concepto) return null;

  const movimientos = movimientosMes
    .filter((m) => m.concepto === concepto)
    .sort((a, b) => a.dia.localeCompare(b.dia));

  const esCredito = movimientos[0]?.tipo === "credito";
  const tipo      = esCredito ? "Créditos" : "Débitos";

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${concepto}`}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.titulo}>{concepto}</h2>
            <p className={styles.subtitulo}>
              {movimientos.length} movimiento{movimientos.length !== 1 ? "s" : ""} · {tipo}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Lista de movimientos */}
        <div className={styles.lista}>
          {movimientos.map((mov, i) => (
            <MovimientoCard
              key={`${mov.dia}-${mov.concepto}-${i}`}
              movimiento={mov}
            />
          ))}
        </div>
      </div>
    </div>
  );
}