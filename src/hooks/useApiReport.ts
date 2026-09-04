"use client";

import { useEffect, useState } from "react";
import { useExcel } from "@/context/ExcelContext";

export function useApiReport<T>(
  endpoint: string,
  extraBody: Record<string, unknown> = {},
  onSuccess?: (data: T) => void,
) {
  const { hojaActiva, movimientosPorHoja } = useExcel();

  const [reporte, setReporte] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extraBodyKey = JSON.stringify(extraBody);

  useEffect(() => {
    if (!hojaActiva || !movimientosPorHoja) return;

    const movimientos = movimientosPorHoja[hojaActiva] ?? [];
    if (movimientos.length === 0) return;

    const fetchReporte = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movimientos, ...JSON.parse(extraBodyKey) }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? "Error al obtener el reporte.");
        }

        const data: T = await res.json();
        setReporte(data);
        onSuccess?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
    
  }, [hojaActiva, movimientosPorHoja, endpoint, extraBodyKey]);

  return { reporte, isLoading, error, hasData: Boolean(hojaActiva) };
}