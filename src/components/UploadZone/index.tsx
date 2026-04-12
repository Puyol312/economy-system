"use client";

import { useRef, useState, useCallback } from "react";
import { useExcel } from "@/context/ExcelContext";
import styles from "./UploadZone.module.css";

/**
 * UploadZone
 *
 * Componente de carga de archivos `.xlsx`. Soporta tanto click
 * para seleccionar como drag & drop.
 *
 * Muestra tres estados distintos:
 * - **Idle**: zona de drop con instrucciones.
 * - **Cargando**: spinner mientras la API procesa el archivo.
 * - **Archivo cargado**: nombre del archivo con opción de quitarlo.
 *
 * Consume `uploadFile` y `clearData` del `ExcelContext`.
 *
 * @example
 * ```tsx
 * // app/page.tsx
 * import UploadZone from "@/components/UploadZone/UploadZone";
 *
 * <UploadZone />
 * ```
 */
export default function UploadZone() {
  const { uploadFile, clearData, fileName, isLoading, error } = useExcel();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /** Valida que el archivo sea .xlsx y lo pasa al context */
  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".xlsx")) return;
      uploadFile(file);
    },
    [uploadFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Resetea el input para permitir subir el mismo archivo de nuevo
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ── Estado: archivo ya cargado ──────────────────────────────
  if (fileName) {
    return (
      <div className={styles.fileLoaded}>
        <div className={styles.fileIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.fileInfo}>
          <p className={styles.fileName}>{fileName}</p>
          <p className={styles.fileStatus}>Archivo procesado correctamente</p>
        </div>
        <button
          className={styles.removeButton}
          onClick={clearData}
          aria-label="Quitar archivo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Quitar
        </button>
      </div>
    );
  }

  // ── Estado: cargando ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.zone}>
        <div className={styles.spinner} aria-label="Procesando archivo" />
        <p className={styles.loadingText}>Procesando archivo...</p>
      </div>
    );
  }

  // ── Estado: idle (zona de drop) ─────────────────────────────
  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.zone} ${isDragging ? styles.dragging : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Zona para subir archivo Excel"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className={styles.hiddenInput}
          onChange={handleInputChange}
        />

        <div className={styles.uploadIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <p className={styles.dropText}>
          {isDragging ? "Soltá el archivo aquí" : "Arrastrá tu archivo aquí"}
        </p>
        <p className={styles.dropSubtext}>o hacé click para seleccionarlo</p>
        <span className={styles.formatBadge}>.xlsx</span>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}