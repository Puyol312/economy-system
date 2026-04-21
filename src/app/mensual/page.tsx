"use client";

import { useEffect, useState } from "react";
import { useExcel } from "@/context/ExcelContext";
import type { ReporteMensualResponse } from "@/app/api/reportes/mensual/route";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import MesesSidebar from "./components/MesesSidebar";
import BalanceDiarioChart from "./components/BalanceDiarioChart";
import TotalesPorDiaChart from "./components/TotalesPorDiaChart";
import ResumenMensual from "./components/ResumenMensual";
import ConceptosTable from "./components/ConceptosTable";
import styles from "./page.module.css";

/**
 * MensualPage — `/mensual`
 *
 * Página de reporte mensual. Manda los movimientos de la hoja activa
 * al endpoint POST /api/reportes/mensual junto con el mes seleccionado.
 */
export default function MensualPage() {
  const { hojaActiva, movimientosPorHoja } = useExcel();

  const [reporte, setReporte]     = useState<ReporteMensualResponse | null>(null);
  const [mesActivo, setMesActivo] = useState<string | null>(null);
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
        const res = await fetch("/api/reportes/mensual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movimientos,
            ...(mesActivo ? { mes: mesActivo } : {}),
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? "Error al obtener el reporte.");
        }

        const data: ReporteMensualResponse = await res.json();
        setMesActivo(data.mes);
        setReporte(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, [hojaActiva, movimientosPorHoja, mesActivo]);

  if (!hojaActiva) {
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
              {Array.from({ length: 3 }).map((_, i) => (
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
          />
          <ConceptosTable
            creditos={reporte.creditos}
            debitos={reporte.debitos}
          />
        </div>
      </div>
    </div>
  );
}