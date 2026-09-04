"use client";

import type { Movimiento } from "@/types";
import styles from "./MovimientoCard.module.css";
import { formatearMoneda } from "@/lib/format";

/**
 * MovimientoCardProps
 */
export interface MovimientoCardProps {
  movimiento: Movimiento;
}

/**
 * Formatea una fecha "AAAA-MM-DD" a "DD/MM/AAAA".
 * @example "2026-04-01" → "01/04/2026"
 */
const formatearFecha = (dia: string): string => {
  const [aaaa, mm, dd] = dia.split("-");
  return `${dd}/${mm}/${aaaa}`;
};

/**
 * MovimientoCard
 *
 * Card que representa un movimiento individual.
 * Muestra siempre: fecha, concepto, monto y tipo.
 * Muestra condicionalmente: nroDocumento, descripcion y asuntoOficial
 * solo si tienen valor.
 *
 * Se usa dentro de `MesSection` para listar todos los movimientos
 * de un mes en la página `/datos`.
 *
 * @example
 * ```tsx
 * <MovimientoCard movimiento={mov} />
 * ```
 */
export default function MovimientoCard({ movimiento }: MovimientoCardProps) {
  const {
    dia,
    concepto,
    monto,
    tipo,
    nroDocumento,
    descripcion,
    asuntoOficial,
  } = movimiento;

  const esCredito = tipo === "credito";

  // Campos opcionales — solo los que tienen valor
  const camposOpcionales = [
    nroDocumento  && { label: "Nro. Documento", valor: nroDocumento  },
    descripcion   && { label: "Descripción",    valor: descripcion   },
    asuntoOficial && { label: "Asunto Oficial", valor: asuntoOficial },
  ].filter(Boolean) as { label: string; valor: string }[];

  return (
    <div className={`${styles.card} ${esCredito ? styles.credito : styles.debito}`}>
      {/* Fila principal */}
      <div className={styles.main}>
        <div className={styles.left}>
          <span className={styles.fecha}>{formatearFecha(dia)}</span>
          <span className={styles.concepto}>{concepto}</span>
        </div>
        <div className={styles.right}>
          <span className={styles.monto}>{formatearMoneda(monto)}</span>
          <span className={`${styles.badge} ${esCredito ? styles.badgeCredito : styles.badgeDebito}`}>
            {esCredito ? "Crédito" : "Débito"}
          </span>
        </div>
      </div>

      {/* Campos opcionales */}
      {camposOpcionales.length > 0 && (
        <div className={styles.extra}>
          {camposOpcionales.map(({ label, valor }) => (
            <div key={label} className={styles.extraRow}>
              <span className={styles.extraLabel}>{label}</span>
              <span className={styles.extraValor}>{valor}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}