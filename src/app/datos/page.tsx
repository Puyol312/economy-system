"use client";

import type { ReporteDatosResponseDTO } from "@/types";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MesSection from "./components/MesSection";
import styles from "./page.module.css";
import { useApiReport } from "@/hooks/useApiReport";

export default function DatosPage() {
  const { reporte, isLoading, error, hasData } = useApiReport<ReporteDatosResponseDTO>("/api/reportes/datos");

  // ── Sin archivo cargado ───────────────────────────────────────
  if (!hasData) {
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