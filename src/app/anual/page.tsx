"use client";

import { useMemo } from "react";
import { useExcel } from "@/context/ExcelContext";
import { calcularBalancePorMes, obtenerTotalesPorMes, obtenerAcumulado } from "@/controllers/MultiMonthController";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import BalanceAnualChart from "./components/BalanceAnualChart";
import TotalesPorMesChart from "./components/TotalesPorMesChart";
import ResumenAnual from "./components/ResumenAnual";
import styles from "./page.module.css";

/**
 * AnualPage — `/anual`
 *
 * Página de reporte anual. Consume los movimientos del `ExcelContext`
 * y los procesa con el `MultiMonthController` para mostrar:
 *
 * - Gráfico de barras: balance neto por mes (panel izquierdo).
 * - Gráficos de área: créditos y débitos por mes (panel derecho, apilados).
 * - Tarjetas de resumen: totales anuales y mejor mes (parte inferior).
 *
 * Si no hay datos cargados muestra un `EmptyState` con un botón
 * para volver a Home a subir el archivo.
 *
 * Es un Client Component porque consume el context y usa `useMemo`.
 */
export default function AnualPage() {
  const { data } = useExcel();

  const balancePorMes  = useMemo(() => data ? calcularBalancePorMes(data) : {}, [data]);
  const creditosPorMes = useMemo(() => data ? obtenerTotalesPorMes(data, "credito") : {}, [data]);
  const debitosPorMes  = useMemo(() => data ? obtenerTotalesPorMes(data, "debito") : {}, [data]);

  const totalCreditos  = useMemo(() => obtenerAcumulado(creditosPorMes), [creditosPorMes]);
  const totalDebitos   = useMemo(() => obtenerAcumulado(debitosPorMes), [debitosPorMes]);
  const balanceAnual   = useMemo(() => obtenerAcumulado(balancePorMes), [balancePorMes]);

  const mejorMes = useMemo(
    () => Object.entries(balancePorMes).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "",
    [balancePorMes]
  );

  if (!data) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para ver el reporte anual necesitás subir un archivo primero."
        href="/"
        buttonLabel="Ir a cargar archivo"
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Reporte anual" breadcrumb="Reportes" />

      <div className={styles.content}>
        {/* ── Gráficos ── */}
        <div className={styles.chartsGrid}>
          {/* Panel izquierdo — balance por mes */}
          <div className={styles.chartMain}>
            <BalanceAnualChart balancePorMes={balancePorMes} />
          </div>

          {/* Panel derecho — créditos y débitos apilados */}
          <div className={styles.chartSide}>
            <TotalesPorMesChart totalesPorMes={creditosPorMes} tipo="credito" />
            <TotalesPorMesChart totalesPorMes={debitosPorMes}  tipo="debito" />
          </div>
        </div>

        {/* ── Resumen ── */}
        <ResumenAnual
          totalCreditos={totalCreditos}
          totalDebitos={totalDebitos}
          balanceAnual={balanceAnual}
          mejorMes={mejorMes}
        />
      </div>
    </div>
  );
}