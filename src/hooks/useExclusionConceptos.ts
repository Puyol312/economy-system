"use client";

import { useState } from "react";
import type { TipoMovimiento } from "@/types";
import { useExcel } from "@/context/ExcelContext";

/**
 * useExclusionConceptos
 *
 * Maneja el estado de qué conceptos están excluidos de los totales
 * mostrados en pantalla (créditos y débitos por separado, por si un
 * mismo nombre de concepto aparece en ambos).
 *
 * No calcula nada — solo guarda el estado. El cálculo lo hace
 * `calcularMetricasFiltradas`, que recibe estos sets como parámetro.
 * Se separan en dos piezas para poder compartir un mismo estado de
 * exclusión entre varios cálculos a la vez (ej. `/comparar`, que
 * aplica la misma exclusión a dos meses distintos en simultáneo).
 *
 * La exclusión persiste mientras navegás dentro de la misma página
 * (ej. cambiar de mes en `/mensual`), pero se resetea al subir un
 * archivo nuevo o cambiar de hoja activa.
 */
export function useExclusionConceptos() {
  const { fileName, hojaActiva } = useExcel();

  const [excluidosCreditos, setExcluidosCreditos] = useState<Set<string>>(new Set());
  const [excluidosDebitos, setExcluidosDebitos] = useState<Set<string>>(new Set());

  // Nuevo archivo u otra hoja -> se resetea la exclusión.
  // Se ajusta durante el render (patrón recomendado por React para
  // "resetear estado cuando cambia algo externo") en vez de con un
  // useEffect, que dispararía un render en cascada innecesario.
  const archivoKey = `${fileName ?? ""}::${hojaActiva ?? ""}`;
  const [archivoKeyPrevio, setArchivoKeyPrevio] = useState(archivoKey);

  if (archivoKey !== archivoKeyPrevio) {
    setArchivoKeyPrevio(archivoKey);
    setExcluidosCreditos(new Set());
    setExcluidosDebitos(new Set());
  }

  const toggleConcepto = (concepto: string, tipo: TipoMovimiento) => {
    const setExcluidos = tipo === "credito" ? setExcluidosCreditos : setExcluidosDebitos;

    setExcluidos((prev) => {
      const next = new Set(prev);
      if (next.has(concepto)) {
        next.delete(concepto);
      } else {
        next.add(concepto);
      }
      return next;
    });
  };

  const estaExcluido = (concepto: string, tipo: TipoMovimiento): boolean => {
    const excluidos = tipo === "credito" ? excluidosCreditos : excluidosDebitos;
    return excluidos.has(concepto);
  };

  const hayExclusiones = excluidosCreditos.size > 0 || excluidosDebitos.size > 0;
  const totalExcluidos = excluidosCreditos.size + excluidosDebitos.size;

  const limpiarExclusiones = () => {
    setExcluidosCreditos(new Set());
    setExcluidosDebitos(new Set());
  };

  return {
    excluidosCreditos,
    excluidosDebitos,
    toggleConcepto,
    estaExcluido,
    hayExclusiones,
    totalExcluidos,
    limpiarExclusiones,
  };
}
