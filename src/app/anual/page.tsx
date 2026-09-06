"use client";

import type { ReporteAnualResponseDTO } from "@/types";

import { useApiReport } from "@/hooks/useApiReport";

import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import BalanceAnualChart from "./components/BalanceAnualChart";
import TotalesPorMesChart from "./components/TotalesPorMesChart";
import ResumenAnual from "./components/ResumenAnual";

import styles from "./page.module.css";

export default function AnualPage() {
  const { reporte, isLoading, error, hasData } =
    useApiReport<ReporteAnualResponseDTO>("/api/reportes/anual");

  if (!hasData) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para ver el reporte anual necesitás subir un archivo primero."
        href="/"
        buttonLabel="Ir a cargar archivo"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error al cargar el reporte"
        description={error}
        href="/"
        buttonLabel="Volver al inicio"
      />
    );
  }

  if (isLoading || !reporte) {
    return (
      <div className={styles.page}>
        <PageHeader title="Reporte anual" breadcrumb="Reportes" />
        <div className={styles.content}>
          <div className={styles.skeleton}>
            <div className={`${styles.skeletonBlock} ${styles.skeletonMain}`} />
            <div className={styles.skeletonSide}>
              <div className={styles.skeletonBlock} />
              <div className={styles.skeletonBlock} />
            </div>
          </div>
          <div className={styles.skeletonResumen}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeletonBlock} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Reporte anual" breadcrumb="Reportes" />
      <div className={styles.content}>
        <div className={styles.chartsGrid}>
          <div className={styles.chartMain}>
            <BalanceAnualChart
              balancePorMes={reporte.balancePorMes}
              saldoAcumulado={reporte.saldoAcumulado}
            />
          </div>
          <div className={styles.chartSide}>
            <TotalesPorMesChart totalesPorMes={reporte.creditosPorMes} tipo="credito" />
            <TotalesPorMesChart totalesPorMes={reporte.debitosPorMes} tipo="debito" />
          </div>
        </div>
        <ResumenAnual
          totalCreditos={reporte.totalCreditos}
          totalDebitos={reporte.totalDebitos}
          balanceAnual={reporte.balanceAnual}
          mejorMes={reporte.mejorMes}
        />
      </div>
    </div>
  );
}
