import { NextRequest, NextResponse } from "next/server";
import { parseExcel } from "@/lib/exel/parseExcel";
import { setMovimientos, clearStore } from "@/lib/store/movimientosStore";

/** Tamaño máximo permitido: 10 MB */
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 *
 * Recibe un archivo `.xlsx` via `multipart/form-data`, parsea todas
 * sus hojas, guarda los movimientos en el store del servidor y
 * devuelve los nombres de las hojas detectadas.
 *
 * El cliente ya no recibe los movimientos directamente, solo
 * la lista de hojas disponibles para mostrar en la homepage.
 *
 * El campo del FormData debe llamarse `file`.
 *
 * Respuestas:
 * - `200` → `{ hojas: string[] }`
 * - `400` → `{ message: string }` si falta el archivo, formato incorrecto o supera el tamaño.
 * - `500` → `{ message: string }` si el parseo falla inesperadamente.
 *
 * @example
 * const formData = new FormData();
 * formData.append("file", file);
 *
 * const res = await fetch("/api/upload", { method: "POST", body: formData });
 * const { hojas } = await res.json();
 * // hojas → ["Cuenta Corriente", "Caja de Ahorro"]
 */
export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  // ── Validaciones ──────────────────────────────────────────────
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { message: "No se recibió ningún archivo." },
      { status: 400 }
    );
  }

  if (!file.name.endsWith(".xlsx")) {
    return NextResponse.json(
      { message: "El archivo debe ser formato .xlsx." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "El archivo supera el tamaño máximo de 10 MB." },
      { status: 400 }
    );
  }

  // ── Parseo y guardado en store ────────────────────────────────
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { hojas, movimientosPorHoja } = parseExcel(buffer);

    // Limpia el store antes de cargar el nuevo archivo
    clearStore();

    for (const hoja of hojas) {
      setMovimientos(hoja, movimientosPorHoja[hoja]);
    }

    return NextResponse.json({ hojas });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al procesar el archivo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}