"use client";

import { useEffect, useState } from "react";
import { useExcel } from "@/context/ExcelContext";
import type { ReporteAnualResponse } from "@/app/api/reportes/anual/route";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import BalanceAnualChart from "./components/BalanceAnualChart";
import TotalesPorMesChart from "./components/TotalesPorMesChart";
import ResumenAnual from "./components/ResumenAnual";
import styles from "./page.module.css";

/**
 * AnualPage — `/anual`
 *
 * Página de reporte anual. Manda los movimientos de la hoja activa
 * al endpoint POST /api/reportes/anual y renderiza los resultados.
 */
export default function AnualPage() {
  const { hojaActiva, movimientosPorHoja } = useExcel();

  const [reporte, setReporte]     = useState<ReporteAnualResponse | null>(null);
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
        const res = await fetch("/api/reportes/anual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movimientos }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? "Error al obtener el reporte.");
        }

        const data: ReporteAnualResponse = await res.json();
        setReporte(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, [hojaActiva, movimientosPorHoja]);

  if (!hojaActiva) {
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
            <BalanceAnualChart balancePorMes={reporte.balancePorMes} />
          </div>
          <div className={styles.chartSide}>
            <TotalesPorMesChart totalesPorMes={reporte.creditosPorMes} tipo="credito" />
            <TotalesPorMesChart totalesPorMes={reporte.debitosPorMes}  tipo="debito" />
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