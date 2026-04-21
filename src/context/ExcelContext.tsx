"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Movimiento } from "@/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Valor expuesto por el ExcelContext.
 *
 * Almacena los movimientos parseados por hoja en el cliente.
 * Los endpoints reciben los movimientos en el body de cada request,
 * sin necesidad de estado en el servidor.
 */
interface ExcelContextValue {
  /** Nombre del archivo subido. `null` si no hay archivo. */
  fileName: string | null;

  /**
   * Hojas detectadas en el Excel.
   * `null` si no se subió ningún archivo aún.
   * @example ["Cuenta Corriente", "Caja de Ahorro"]
   */
  hojas: string[] | null;

  /**
   * Hoja actualmente seleccionada por el usuario.
   * Se inicializa con la primera hoja al subir el archivo.
   */
  hojaActiva: string | null;

  /**
   * Movimientos parseados agrupados por hoja.
   * `null` si no se subió ningún archivo aún.
   * @example { "Cuenta Corriente": [...], "Caja de Ahorro": [...] }
   */
  movimientosPorHoja: Record<string, Movimiento[]> | null;

  /** `true` mientras se espera respuesta de la API. */
  isLoading: boolean;

  /** Mensaje de error si la subida falló. `null` si no hay error. */
  error: string | null;

  /**
   * Sube el archivo a la API, obtiene los movimientos parseados
   * por hoja y los guarda en el contexto.
   *
   * @param file - El archivo `.xlsx` seleccionado por el usuario.
   */
  uploadFile: (file: File) => Promise<void>;

  /**
   * Cambia la hoja activa.
   * @param hoja - Nombre de la hoja a activar.
   */
  setHojaActiva: (hoja: string) => void;

  /**
   * Limpia toda la data del contexto.
   * Permite al usuario quitar el archivo y subir uno nuevo.
   */
  clearData: () => void;
}

// ─── Creación del Context ─────────────────────────────────────────────────────

const ExcelContext = createContext<ExcelContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * ExcelProvider
 *
 * Proveedor del contexto global del archivo Excel.
 * Debe envolver toda la app en `layout.tsx`.
 *
 * Almacena los movimientos por hoja en el cliente (browser).
 * Las páginas leen del context y mandan los movimientos en el
 * body de cada request a los endpoints de reportes.
 * Esto funciona igual en desarrollo y producción sin necesidad
 * de estado en el servidor.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { ExcelProvider } from "@/context/ExcelContext";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ExcelProvider>
 *           <Navbar />
 *           <main>{children}</main>
 *         </ExcelProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ExcelProvider({ children }: { children: ReactNode }) {
  const [fileName, setFileName]                     = useState<string | null>(null);
  const [hojas, setHojas]                           = useState<string[] | null>(null);
  const [hojaActiva, setHojaActiva]                 = useState<string | null>(null);
  const [movimientosPorHoja, setMovimientosPorHoja] = useState<Record<string, Movimiento[]> | null>(null);
  const [isLoading, setIsLoading]                   = useState(false);
  const [error, setError]                           = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Error al procesar el archivo.");
      }

      const {
        hojas: hojasDetectadas,
        movimientosPorHoja: movimientos,
      }: { hojas: string[]; movimientosPorHoja: Record<string, Movimiento[]> } = await res.json();

      setFileName(file.name);
      setHojas(hojasDetectadas);
      setHojaActiva(hojasDetectadas[0] ?? null);
      setMovimientosPorHoja(movimientos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useExcel
 *
 * Hook para consumir el ExcelContext desde cualquier componente.
 * Lanza un error si se usa fuera del `ExcelProvider`.
 *
 * @example
 * ```tsx
 * const { hojas, hojaActiva, movimientosPorHoja, setHojaActiva } = useExcel();
 * ```
 */
export function useExcel(): ExcelContextValue {
  const ctx = useContext(ExcelContext);
  if (!ctx) {
    throw new Error("useExcel debe usarse dentro de un <ExcelProvider>.");
  }
  return ctx;
}