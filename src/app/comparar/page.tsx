"use client";

import { useMemo, useState } from "react";
import { useExcel } from "@/context/ExcelContext";
import { useExclusionConceptos } from "@/hooks/useExclusionConceptos";
import { agruparMovimientosPorMes } from "@/services/reports/calculations/monthly";
import { calcularMetricasFiltradas } from "@/services/reports/calculations/metricas";

import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SelectorMeses from "./components/SelectorMeses";
import ComparacionResumen from "./components/ComparacionResumen";
import ComparacionConceptos from "./components/ComparacionConceptos";

import styles from "./page.module.css";

export default function CompararPage() {
  const { hojaActiva, movimientosPorHoja } = useExcel();
  const exclusion = useExclusionConceptos();

  const movimientos = useMemo(
    () => (hojaActiva && movimientosPorHoja ? (movimientosPorHoja[hojaActiva] ?? []) : []),
    [hojaActiva, movimientosPorHoja],
  );

  const movimientosPorMes = useMemo(
    () => agruparMovimientosPorMes(movimientos),
    [movimientos],
  );

  const meses = useMemo(() => Object.keys(movimientosPorMes).sort(), [movimientosPorMes]);

  // Por defecto, comparar los dos meses más recientes. Si se sube un
  // archivo nuevo (cambia el listado de meses), se vuelve a elegir
  // ese default en vez de mantener la selección del archivo anterior.
  const mesesKey = meses.join(",");
  const [mesesKeyPrevio, setMesesKeyPrevio] = useState(mesesKey);
  const [mesA, setMesA] = useState(() => meses[meses.length - 2] ?? meses[0] ?? "");
  const [mesB, setMesB] = useState(() => meses[meses.length - 1] ?? "");

  if (mesesKey !== mesesKeyPrevio) {
    setMesesKeyPrevio(mesesKey);
    setMesA(meses[meses.length - 2] ?? meses[0] ?? "");
    setMesB(meses[meses.length - 1] ?? "");
  }

  const metricasA = useMemo(
    () =>
      calcularMetricasFiltradas(
        movimientosPorMes[mesA] ?? [],
        exclusion.excluidosCreditos,
        exclusion.excluidosDebitos,
      ),
    [movimientosPorMes, mesA, exclusion.excluidosCreditos, exclusion.excluidosDebitos],
  );

  const metricasB = useMemo(
    () =>
      calcularMetricasFiltradas(
        movimientosPorMes[mesB] ?? [],
        exclusion.excluidosCreditos,
        exclusion.excluidosDebitos,
      ),
    [movimientosPorMes, mesB, exclusion.excluidosCreditos, exclusion.excluidosDebitos],
  );

  const hasData = Boolean(hojaActiva && movimientosPorHoja);

  if (!hasData) {
    return (
      <EmptyState
        title="Sin datos cargados"
        description="Para comparar meses necesitás subir un archivo primero."
        href="/"
        buttonLabel="Ir a cargar archivo"
      />
    );
  }

  if (meses.length < 2) {
    return (
      <div className={styles.page}>
        <PageHeader title="Comparar meses" breadcrumb="Reportes" />
        <div className={styles.content}>
          <EmptyState
            title="Necesitás al menos 2 meses"
            description="Tu archivo solo tiene datos de un mes. Subí un archivo con más de un mes para poder compararlos."
            href="/mensual"
            buttonLabel="Ver reporte mensual"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Comparar meses" breadcrumb="Reportes" />
      <div className={styles.content}>
        <div className={styles.controls}>
          <SelectorMeses
            meses={meses}
            mesA={mesA}
            mesB={mesB}
            onMesAChange={setMesA}
            onMesBChange={setMesB}
          />

          {exclusion.hayExclusiones && (
            <div className={styles.avisoFiltro} role="status">
              <span>
                {exclusion.totalExcluidos} concepto
                {exclusion.totalExcluidos !== 1 ? "s" : ""} excluido
                {exclusion.totalExcluidos !== 1 ? "s" : ""} de la comparación.
              </span>
              <button className={styles.avisoFiltroBoton} onClick={exclusion.limpiarExclusiones}>
                Mostrar todo
              </button>
            </div>
          )}
        </div>

        <ComparacionResumen
          mesA={mesA}
          mesB={mesB}
          totalCreditosA={metricasA.totalCreditos}
          totalCreditosB={metricasB.totalCreditos}
          totalDebitosA={metricasA.totalDebitos}
          totalDebitosB={metricasB.totalDebitos}
          balanceA={metricasA.balanceMes}
          balanceB={metricasB.balanceMes}
        />

        <div className={styles.conceptosGrid}>
          <ComparacionConceptos
            titulo="Créditos"
            mesA={mesA}
            mesB={mesB}
            conceptosA={metricasA.creditosPorConcepto}
            conceptosB={metricasB.creditosPorConcepto}
            tipo="credito"
            colorClass={styles.credito}
            estaExcluido={exclusion.estaExcluido}
            onToggleConcepto={exclusion.toggleConcepto}
          />
          <ComparacionConceptos
            titulo="Débitos"
            mesA={mesA}
            mesB={mesB}
            conceptosA={metricasA.debitosPorConcepto}
            conceptosB={metricasB.debitosPorConcepto}
            tipo="debito"
            colorClass={styles.debito}
            estaExcluido={exclusion.estaExcluido}
            onToggleConcepto={exclusion.toggleConcepto}
          />
        </div>
      </div>
    </div>
  );
}