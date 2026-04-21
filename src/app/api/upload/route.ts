import { NextRequest, NextResponse } from "next/server";
import { parseExcel } from "@/lib/exel/parseExcel";

/** Tamaño máximo permitido: 10 MB */
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 *
 * Recibe un archivo `.xlsx` via `multipart/form-data`, parsea todas
 * sus hojas y devuelve las hojas detectadas junto con los movimientos
 * normalizados por hoja.
 *
 * Los movimientos se devuelven al cliente y se almacenan en el
 * ExcelContext. Las páginas los mandan en el body de cada request
 * a los endpoints de reportes, sin necesidad de estado en el servidor.
 *
 * El campo del FormData debe llamarse `file`.
 *
 * Respuestas:
 * - `200` → `{ hojas: string[], movimientosPorHoja: Record<string, Movimiento[]> }`
 * - `400` → `{ message: string }` si falta el archivo, formato incorrecto o supera el tamaño.
 * - `500` → `{ message: string }` si el parseo falla inesperadamente.
 *
 * @example
 * const formData = new FormData();
 * formData.append("file", file);
 *
 * const res = await fetch("/api/upload", { method: "POST", body: formData });
 * const { hojas, movimientosPorHoja } = await res.json();
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
    const { hojas, movimientosPorHoja } = parseExcel(buffer);

    return NextResponse.json({ hojas, movimientosPorHoja });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al procesar el archivo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}