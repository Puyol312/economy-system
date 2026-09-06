/**
 * Formatea un número como moneda local (ARS).
 * Sin decimales si el monto es un peso entero; con 2 decimales
 * si tiene centavos.
 * @example formatearMoneda(50000) // "$50.000"
 * @example formatearMoneda(99.5)  // "$99,50"
 */
export const formatearMoneda = (valor: number): string => {
  const esEntero = Math.abs(valor - Math.round(valor)) < 0.005;
  const decimales = esEntero ? 0 : 2;

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
};

/**
 * Formatea un número en notación compacta, para ejes de gráficos.
 * @example formatearCompacto(1500000) // "1,5 M"
 */
export const formatearCompacto = (valor: number): string =>
  new Intl.NumberFormat("es-AR", {
    notation: "compact",
    compactDisplay: "short",
  }).format(valor);

/**
 * Convierte un mes "YYYY-MM" a un string legible y capitalizado.
 * @example formatearMes("2026-04") // "Abril 2026"
 */
export const formatearMes = (mes: string): string => {
  const [anio, mm] = mes.split("-");
  const fecha = new Date(Number(anio), Number(mm) - 1, 1);
  const label = fecha.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const extraerDia = (fecha: string): string => fecha.split("-")[2] ?? fecha;

/** Nombres cortos de los meses, para ejes de gráficos. */
export const MESES_CORTOS: Record<string, string> = {
  "01": "Ene",
  "02": "Feb",
  "03": "Mar",
  "04": "Abr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic",
};
