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
 */
interface ExcelContextValue {
  /**
   * Movimientos normalizados provenientes del Excel.
   * `null` si no se subió ningún archivo aún.
   */
  data: Movimiento[] | null;

  /** Nombre del archivo subido. `null` si no hay archivo. */
  fileName: string | null;

  /** `true` mientras se espera respuesta de la API. */
  isLoading: boolean;

  /** Mensaje de error si la subida o el parseo falló. `null` si no hay error. */
  error: string | null;

  /**
   * Sube el archivo a la API, obtiene los movimientos parseados
   * y los guarda en el contexto.
   *
   * @param file - El archivo `.xlsx` seleccionado por el usuario.
   */
  uploadFile: (file: File) => Promise<void>;

  /**
   * Limpia toda la data del contexto.
   * Permite al usuario quitar el archivo actual y subir uno nuevo.
   */
  clearData: () => void;
}

// ─── Creación del Context ─────────────────────────────────────────────────────

const ExcelContext = createContext<ExcelContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * ExcelProvider
 *
 * Proveedor del contexto global de datos del Excel.
 * Debe envolver toda la app en `layout.tsx` para que cualquier
 * página pueda acceder a la data sin necesidad de re-fetchear.
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
  const [data, setData] = useState<Movimiento[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { movimientos }: { movimientos: Movimiento[] } = await res.json();
      setData(movimientos);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setFileName(null);
    setError(null);
  }, []);

  return (
    <ExcelContext.Provider
      value={{ data, fileName, isLoading, error, uploadFile, clearData }}
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
 * const { data, fileName, isLoading } = useExcel();
 *
 * // data es Movimiento[] | null
 * data?.filter(m => m.tipo === "credito")
 * ```
 */
export function useExcel(): ExcelContextValue {
  const ctx = useContext(ExcelContext);
  if (!ctx) {
    throw new Error("useExcel debe usarse dentro de un <ExcelProvider>.");
  }
  return ctx;
}