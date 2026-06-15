"use client";

import { useEffect, useState } from "react";
import { useExcel } from "@/context/ExcelContext";
import type { ReporteDatosResponse } from "@/app/api/reportes/datos/route";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MesSection from "./components/MesSection";
import styles from "./page.module.css";

/**
 * DatosPage — `/datos`
 *
 * Página que muestra todos los movimientos del archivo cargado
 * agrupados por mes, uno debajo del otro.
 *
 * Cada mes muestra un header con totales y una lista de cards
 * con el detalle de cada movimiento incluyendo los campos
 * opcionales si tienen valor.
 *
 * Si no hay datos cargados muestra un `EmptyState`.
 */
export default function DatosPage() {
  const { hojaActiva, movimientosPorHoja } = useExcel();

  const [reporte, setReporte]     = useState<ReporteDatosResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!hojaActiva || !movimientosPorHoja) return;

    const movimientos = movimientosPorHoja[hojaActiva];
    if (!movimientos) return;

    const fetchReporte = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/reportes/datos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movimientos }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? "Error al obtener los datos.");
        }

        const data: ReporteDatosResponse = await res.json();
        setReporte(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, [hojaActiva, movimientosPorHoja]);

  // ── Sin archivo cargado ───────────────────────────────────────
  if (!hojaActiva) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para ver los movimientos necesitás subir un archivo primero."
        href="/"
        buttonLabel="Ir a cargar archivo"
      />
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <EmptyState
        title="Error al cargar los datos"
        description={error}
        href="/"
        buttonLabel="Volver al inicio"
      />
    );
  }

  // ── Loading ───────────────────────────────────────────────────
  if (isLoading || !reporte) {
    return (
      <div className={styles.page}>
        <PageHeader title="Datos" breadcrumb="Movimientos" />
        <div className={styles.content}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonSection}>
              <div className={styles.skeletonHeader} />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className={styles.skeletonCard} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Con datos ─────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <PageHeader title="Datos" breadcrumb="Movimientos" />
      <div className={styles.content}>
        {reporte.meses.map((mes) => (
          <MesSection
            key={mes}
            mes={mes}
            movimientos={reporte.movimientosPorMes[mes]}
          />
        ))}
      </div>
    </div>
  );
}