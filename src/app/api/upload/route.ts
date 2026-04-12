import { NextRequest, NextResponse } from "next/server";
import { parseExcel } from "@/lib/exel/parseExcel";

/** Tamaño máximo permitido: 10 MB */
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 *
 * Recibe un archivo `.xlsx` via `multipart/form-data`, lo parsea
 * y devuelve un arreglo de movimientos normalizados.
 *
 * El campo del FormData debe llamarse `file`.
 *
 * Respuestas:
 * - `200` → `{ movimientos: Movimiento[] }`
 * - `400` → `{ message: string }` si falta el archivo, el formato es incorrecto o supera el tamaño.
 * - `500` → `{ message: string }` si el parseo falla inesperadamente.
 *
 * @example
 * // Desde el ExcelContext (uploadFile)
 * const formData = new FormData();
 * formData.append("file", file);
 *
 * const res = await fetch("/api/upload", { method: "POST", body: formData });
 * const { movimientos } = await res.json();
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

  // ── Parseo ────────────────────────────────────────────────────
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const movimientos = parseExcel(buffer);

    return NextResponse.json({ movimientos });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al procesar el archivo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}