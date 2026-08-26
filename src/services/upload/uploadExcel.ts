import type { UploadResponseDTO } from "@/types";

export const uploadExcel = async ( file: File,): Promise<UploadResponseDTO> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.message ?? "Error al procesar el archivo.",
    );
  }

  return response.json();
};