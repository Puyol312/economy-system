"use client";

import { useState } from "react";
import type { ReporteMensualResponseDTO } from "@/types";
import { useApiReport } from "./useApiReport";

export const useMonthlyReport = () => {
  const [mesActivo, setMesActivo] = useState<string | null>(null);

  const { reporte, isLoading, error, hasData } =
    useApiReport<ReporteMensualResponseDTO>(
      "/api/reportes/mensual",
      mesActivo ? { mes: mesActivo } : {},
      (data) => setMesActivo(data.mes),
    );

  return { reporte, mesActivo, setMesActivo, isLoading, error, hasData };
};