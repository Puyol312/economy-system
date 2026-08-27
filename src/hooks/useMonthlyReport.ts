"use client";
import type { Movimiento } from "@/types";
import type { ReporteMensualResponseDTO } from "@/types";

import { useEffect, useState } from "react";

import { useExcel } from "@/context/ExcelContext";


export const useMonthlyReport = () => {
  const { hojaActiva, movimientosPorHoja } = useExcel();

  const [reporte, setReporte] = useState<ReporteMensualResponseDTO | null>(null);
  const [mesActivo, setMesActivo] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hojaActiva || !movimientosPorHoja) return;

    const movimientos: Movimiento[] = movimientosPorHoja[hojaActiva] ?? [];

    if (movimientos.length === 0) return;

    const fetchReporte = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/reportes/mensual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movimientos,
            ...(mesActivo ? { mes: mesActivo } : {}),
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));

          throw new Error( body.message ?? "Error al obtener el reporte.");
        }

        const data: ReporteMensualResponseDTO = await response.json();

        setReporte(data);
        setMesActivo(data.mes);
      } catch (err) {
        setError( err instanceof Error ? err.message : "Error desconocido." );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, [hojaActiva, movimientosPorHoja, mesActivo]);

  return {
    reporte,
    mesActivo,
    setMesActivo,
    isLoading,
    error,
    hasData: Boolean(hojaActiva),
  };
};