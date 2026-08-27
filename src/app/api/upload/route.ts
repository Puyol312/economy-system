import { NextRequest, NextResponse } from "next/server";

import { processExcelUpload } from "@/services/upload/processExcelUpload";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { message: "No se recibió ningún archivo." },
      { status: 400 },
    );
  }

  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json(
      { message: "El archivo debe ser formato .xlsx." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "El archivo supera el tamaño máximo de 10 MB." },
      { status: 400 },
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const response = processExcelUpload(buffer);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al procesar el archivo.";

    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}