"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./TotalesPorDiaChart.module.css";

/**
 * Entrada de dato para el gráfico.
 * Se construye a partir del resultado de `obtenerTotalesPorDia`.
 */
interface TotalDiaData {
  dia: string;
  total: number;
}

/**
 * TotalesPorDiaChartProps
 */
export interface TotalesPorDiaChartProps {
  /**
   * Record de totales por día proveniente de `obtenerTotalesPorDia`.
   * @example { "2026-04-01": 50000, "2026-04-05": 10000 }
   */
  totalesPorDia: Record<string, number>;

  /**
   * Tipo de movimiento que representa el gráfico.
   * Define el título y el color de las barras.
   */
  tipo: "credito" | "debito";
}

/**
 * Props del tooltip personalizado.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  tipo: "credito" | "debito";
}

/** Colores por tipo */
const COLORES = {
  credito: "#1D9E75",
  debito:  "#D85A30",
};

/** Títulos por tipo */
const TITULOS = {
  credito: "Créditos por día",
  debito:  "Débitos por día",
};

/**
 * Formatea un número como moneda local sin decimales.
 * @example 50000 → "$50.000"
 */
const formatearMoneda = (valor: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

/**
 * Extrae el número de día de una fecha "YYYY-MM-DD".
 * @example "2026-04-15" → "15"
 */
const extraerDia = (fecha: string): string => fecha.split("-")[2] ?? fecha;

/**
 * Tooltip personalizado para el gráfico de totales por día.
 */
function CustomTooltip({ active, payload, label, tipo }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const valor = payload[0].value ?? 0;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>Día {label}</p>
      <p className={styles.tooltipValue} style={{ color: COLORES[tipo] }}>
        {formatearMoneda(valor)}
      </p>
    </div>
  );
}

/**
 * TotalesPorDiaChart
 *
 * Gráfico de barras secundario de la página `/mensual`.
 * Muestra los totales diarios de créditos o débitos del mes seleccionado.
 *
 * Es reutilizable: el `tipo` define el color y el título.
 * Se usa dos veces en la página, una para créditos y otra para débitos.
 *
 * Recibe directamente el resultado de `obtenerTotalesPorDia` del
 * `SingleMonthController`.
 *
 * @example
 * ```tsx
 * // app/mensual/page.tsx
 * const movimientosMes  = agruparMovimientosPorMes(data)[mesActivo] ?? [];
 * const creditosPorDia  = obtenerTotalesPorDia(movimientosMes, "credito");
 * const debitosPorDia   = obtenerTotalesPorDia(movimientosMes, "debito");
 *
 * <TotalesPorDiaChart totalesPorDia={creditosPorDia} tipo="credito" />
 * <TotalesPorDiaChart totalesPorDia={debitosPorDia}  tipo="debito" />
 * ```
 */
export default function TotalesPorDiaChart({
  totalesPorDia,
  tipo,
}: TotalesPorDiaChartProps) {
  const chartData: TotalDiaData[] = Object.entries(totalesPorDia)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, total]) => ({
      dia: extraerDia(dia),
      total,
    }));

  const color = COLORES[tipo];

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{TITULOS[tipo]}</p>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="40%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("es-AR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
              width={48}
            />
            <Tooltip
              content={<CustomTooltip tipo={tipo} />}
              cursor={{ fill: "var(--surface)" }}
            />
            <Bar
              dataKey="total"
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}