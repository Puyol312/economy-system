"use client";

import type { Movimiento } from "@/types";
import MovimientoCard from "@/components/MovimientoCard";
import styles from "./MesSection.module.css";
import { useState } from "react";

/**
 * MesSectionProps
 */
export interface MesSectionProps {
  /**
   * Mes en formato "YYYY-MM".
   * @example "2026-04"
   */
  mes: string;

  /**
   * Movimientos del mes, ya ordenados cronológicamente.
   */
  movimientos: Movimiento[];
}

/**
 * Convierte un mes "YYYY-MM" a un string legible capitalizado.
 * @example "2026-04" → "Abril 2026"
 */
const formatearMes = (mes: string): string => {
  const [anio, mm] = mes.split("-");
  const fecha = new Date(Number(anio), Number(mm) - 1, 1);
  const label = fecha.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

/**
 * MesSection
 *
 * Sección que agrupa todas las cards de movimientos de un mes.
 * Muestra un header con el nombre del mes y la cantidad de
 * movimientos, seguido de una lista de `MovimientoCard`.
 *
 * Se usa en la página `/datos` para renderizar todos los meses
 * disponibles uno debajo del otro.
 *
 * @example
 * ```tsx
 * <MesSection mes="2026-04" movimientos={movimientosPorMes["2026-04"]} />
 * ```
 */
export default function MesSection({ mes, movimientos }: MesSectionProps) {
  const LIMITE_INICIAL = 4;

  const [verTodos, setVerTodos] = useState(false);

  const movimientosVisibles = verTodos
    ? movimientos
    : movimientos.slice(0, LIMITE_INICIAL);

  const hayMas = movimientos.length > LIMITE_INICIAL;
  const totalCreditos = movimientos
    .filter((m) => m.tipo === "credito")
    .reduce((acc, m) => acc + m.monto, 0);

  const totalDebitos = movimientos
    .filter((m) => m.tipo === "debito")
    .reduce((acc, m) => acc + m.monto, 0);

  return (
    <section className={styles.section}>
      {/* Header del mes */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.titulo}>{formatearMes(mes)}</h2>
          <span className={styles.cantidad}>
            {movimientos.length} movimiento{movimientos.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.credito}>
            +{new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 0,
            }).format(totalCreditos)}
          </span>
          <span className={styles.debito}>
            -{new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 0,
            }).format(totalDebitos)}
          </span>
        </div>
      </div>

      {/* Lista de cards */}
      <div className={styles.lista}>
        {movimientosVisibles.map((mov, i) => (
          <MovimientoCard key={`${mov.dia}-${mov.concepto}-${i}`} movimiento={mov} />
        ))}
      </div>

      {hayMas && (
        <button
          className={styles.verMas}
          onClick={() => setVerTodos((prev) => !prev)}
        >
          {verTodos
            ? "Ver menos"
            : `Ver ${movimientos.length - LIMITE_INICIAL} más`}
        </button>
      )}
    </section>
  );
}