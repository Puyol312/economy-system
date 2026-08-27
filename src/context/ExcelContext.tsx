"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { Movimiento } from "@/types";
import { uploadExcel } from "@/services/upload/uploadExcel";

interface ExcelContextValue {
  fileName: string | null;
  hojas: string[] | null;
  hojaActiva: string | null;
  movimientosPorHoja: Record<string, Movimiento[]> | null;
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  setHojaActiva: (hoja: string) => void;
  clearData: () => void;
}

const ExcelContext = createContext<ExcelContextValue | null>(null);

export function ExcelProvider({ children }: { children: ReactNode }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [hojas, setHojas] = useState<string[] | null>(null);
  const [hojaActiva, setHojaActiva] = useState<string | null>(null);
  const [movimientosPorHoja, setMovimientosPorHoja] = useState<Record<string, Movimiento[]> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const { hojas, movimientosPorHoja } = await uploadExcel(file);

      setFileName(file.name);
      setHojas(hojas);
      setHojaActiva(hojas[0] ?? null);
      setMovimientosPorHoja(movimientosPorHoja);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al procesar el archivo."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setFileName(null);
    setHojas(null);
    setHojaActiva(null);
    setMovimientosPorHoja(null);
    setError(null);
  }, []);

  return (
    <ExcelContext.Provider
      value={{
        fileName,
        hojas,
        hojaActiva,
        movimientosPorHoja,
        isLoading,
        error,
        uploadFile,
        setHojaActiva,
        clearData,
      }}
    >
      {children}
    </ExcelContext.Provider>
  );
}

export function useExcel(): ExcelContextValue {
  const context = useContext(ExcelContext);

  if (!context) {
    throw new Error(
      "useExcel debe usarse dentro de un <ExcelProvider>."
    );
  }

  return context;
}