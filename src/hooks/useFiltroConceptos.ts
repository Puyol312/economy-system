"use client";

import { useMemo } from "react";
import type { Movimiento } from "@/types";
import { useExclusionConceptos } from "./useExclusionConceptos";
import { calcularMetricasFiltradas } from "@/services/reports/calculations/metricas";

/**
 * useFiltroConceptos
 *
 * Combina `useExclusionConceptos` (estado de qué se excluye) con
 * `calcularMetricasFiltradas` (recálculo de totales, balance y
 * gráficos) para un único mes. Pensado para `/mensual`.
 *
 * IMPORTANTE: no toca `saldoAlCierre` — ese valor sigue viniendo tal
 * cual del reporte del servidor, sin pasar por este filtro.
 */
export function useFiltroConceptos(movimientosMes: Movimiento[]) {
  const exclusion = useExclusionConceptos();

  const metricas = useMemo(
    () =>
      calcularMetricasFiltradas(
        movimientosMes,
        exclusion.excluidosCreditos,
        exclusion.excluidosDebitos,
      ),
    [movimientosMes, exclusion.excluidosCreditos, exclusion.excluidosDebitos],
  );

  return { ...exclusion, ...metricas };
}
