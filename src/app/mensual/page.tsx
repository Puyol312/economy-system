"use client";

import { useMemo, useState } from "react";
import { useExcel } from "@/context/ExcelContext";
import { calcularBalance, calcularBalancePorDia, obtenerTotalesPorDia, sumarTotales } from "@/controllers/SingleMonthController";
import { agruparMovimientosPorMes } from "@/controllers/MultiMonthController";
import { agruparPorConcepto } from "@/controllers/SingleMonthController";
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
 * Página de reporte mensual. Consume los movimientos del `ExcelContext`
 * y los procesa con los controladores para mostrar el análisis
 * del mes seleccionado en el sidebar.
 *
 * Estructura:
 * - Sidebar izquierdo: lista de meses disponibles.
 * - Panel principal:
 *   - Gráfico de balance diario (principal).
 *   - Gráficos de créditos y débitos por día (secundarios).
 *   - Tarjetas de resumen del mes.
 *   - Tabla de conceptos agrupados.
 *
 * Si no hay datos cargados muestra un `EmptyState`.
 *
 * Es un Client Component porque consume el context y gestiona
 * el mes activo con `useState`.
 */
export default function MensualPage() {
  const { data } = useExcel();

  // ── Meses disponibles ─────────────────────────────────────────
  const movimientosPorMes = useMemo(
    () => (data ? agruparMovimientosPorMes(data) : {}),
    [data]
  );

  const meses = useMemo(
    () => Object.keys(movimientosPorMes).sort(),
    [movimientosPorMes]
  );

  const [mesActivo, setMesActivo] = useState<string>(() => meses[0] ?? "");

  // ── Movimientos del mes seleccionado ──────────────────────────
  const movimientosMes = useMemo(
    () => movimientosPorMes[mesActivo] ?? [],
    [movimientosPorMes, mesActivo]
  );

  // ── Cálculos del mes ──────────────────────────────────────────
  const balancePorDia  = useMemo(() => calcularBalancePorDia(movimientosMes),              [movimientosMes]);
  const creditosPorDia = useMemo(() => obtenerTotalesPorDia(movimientosMes, "credito"),    [movimientosMes]);
  const debitosPorDia  = useMemo(() => obtenerTotalesPorDia(movimientosMes, "debito"),     [movimientosMes]);

  const totalCreditos  = useMemo(() => sumarTotales(creditosPorDia),                       [creditosPorDia]);
  const totalDebitos   = useMemo(() => sumarTotales(debitosPorDia),                        [debitosPorDia]);
  const balanceMes     = useMemo(() => calcularBalance(movimientosMes),                    [movimientosMes]);

  const creditos       = useMemo(() => agruparPorConcepto(movimientosMes, "credito"),      [movimientosMes]);
  const debitos        = useMemo(() => agruparPorConcepto(movimientosMes, "debito"),       [movimientosMes]);

  if (!data) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para ver el reporte mensual necesitás subir un archivo primero."
        href="/"
        buttonLabel="Ir a cargar archivo"
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Reporte mensual" breadcrumb="Reportes" />

      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <MesesSidebar
          meses={meses}
          mesActivo={mesActivo}
          onMesChange={setMesActivo}
        />

        {/* ── Contenido principal ── */}
        <div className={styles.content}>
          {/* Gráficos */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartMain}>
              <BalanceDiarioChart balancePorDia={balancePorDia} />
            </div>
            <div className={styles.chartSide}>
              <TotalesPorDiaChart totalesPorDia={creditosPorDia} tipo="credito" />
              <TotalesPorDiaChart totalesPorDia={debitosPorDia}  tipo="debito" />
            </div>
          </div>

          {/* Resumen */}
          <ResumenMensual
            totalCreditos={totalCreditos}
            totalDebitos={totalDebitos}
            balanceMes={balanceMes}
          />

          {/* Tabla de conceptos */}
          <ConceptosTable creditos={creditos} debitos={debitos} />
        </div>
      </div>
    </div>
  );
}