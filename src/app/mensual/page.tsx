"use client";

import { useMonthlyReport } from "@/hooks/useMonthlyReport";

import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

import MesesSidebar from "./components/MesesSidebar";
import BalanceDiarioChart from "./components/BalanceDiarioChart";
import TotalesPorDiaChart from "./components/TotalesPorDiaChart";
import ResumenMensual from "./components/ResumenMensual";
import ConceptosTable from "./components/ConceptosTable";

import styles from "./page.module.css";

export default function MensualPage() {
  const { reporte, mesActivo, setMesActivo, isLoading, error, hasData } = useMonthlyReport();

  if (!hasData) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para ver el reporte mensual necesitás subir un archivo primero."
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

  if (isLoading || !reporte || !mesActivo) {
    return (
      <div className={styles.page}>
        <PageHeader title="Reporte mensual" breadcrumb="Reportes" />
        <div className={styles.layout}>
          <div className={styles.skeletonSidebar} />
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
            <div className={`${styles.skeletonBlock} ${styles.skeletonTable}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Reporte mensual" breadcrumb="Reportes" />
      <div className={styles.layout}>
        <MesesSidebar
          meses={reporte.meses}
          mesActivo={mesActivo}
          onMesChange={setMesActivo}
        />
        <div className={styles.content}>
          <div className={styles.chartsGrid}>
            <div className={styles.chartMain}>
              <BalanceDiarioChart balancePorDia={reporte.balancePorDia} />
            </div>
            <div className={styles.chartSide}>
              <TotalesPorDiaChart totalesPorDia={reporte.creditosPorDia} tipo="credito" />
              <TotalesPorDiaChart totalesPorDia={reporte.debitosPorDia}  tipo="debito" />
            </div>
          </div>
          <ResumenMensual
            totalCreditos={reporte.totalCreditos}
            totalDebitos={reporte.totalDebitos}
            balanceMes={reporte.balanceMes}
            saldoAlCierre={reporte.saldoAlCierre}
          />
          <ConceptosTable
            creditos={reporte.creditos}
            debitos={reporte.debitos}
            movimientosMes={reporte.movimientosMes}
          />
        </div>
      </div>
    </div>
  );
}