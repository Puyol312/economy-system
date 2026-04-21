"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Valor expuesto por el ExcelContext.
 *
 * Ya no almacena los movimientos en el cliente. Solo guarda
 * metadata del archivo: nombre, hojas disponibles y hoja activa.
 * Los movimientos viven en el store del servidor.
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

  /** `true` mientras se espera respuesta de la API. */
  isLoading: boolean;

  /** Mensaje de error si la subida falló. `null` si no hay error. */
  error: string | null;

  /**
   * Sube el archivo a la API, guarda las hojas detectadas
   * y establece la primera hoja como activa.
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
   * Limpia toda la metadata del contexto.
   * También limpia el store del servidor vía DELETE /api/upload.
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
 * A diferencia de la versión anterior, ya no almacena movimientos
 * en el cliente. Solo guarda el nombre del archivo, las hojas
 * disponibles y la hoja activa. Los movimientos viven en el
 * store del servidor y se consultan vía API.
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
  const [fileName, setFileName]       = useState<string | null>(null);
  const [hojas, setHojas]             = useState<string[] | null>(null);
  const [hojaActiva, setHojaActiva]   = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

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

      const { hojas: hojasDetectadas }: { hojas: string[] } = await res.json();

      setFileName(file.name);
      setHojas(hojasDetectadas);
      setHojaActiva(hojasDetectadas[0] ?? null);
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
    setError(null);
  }, []);

  return (
    <ExcelContext.Provider
      value={{
        fileName,
        hojas,
        hojaActiva,
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
 * const { hojas, hojaActiva, setHojaActiva, isLoading } = useExcel();
 * ```
 */
export function useExcel(): ExcelContextValue {
  const ctx = useContext(ExcelContext);
  if (!ctx) {
    throw new Error("useExcel debe usarse dentro de un <ExcelProvider>.");
  }
  return ctx;
}