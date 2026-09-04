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
import { formatearMoneda, extraerDia, formatearCompacto } from "@/lib/format";

interface TotalDiaData {
  dia: string;
  total: number;
}

export interface TotalesPorDiaChartProps {
  /** Totales por día proveniente de `obtenerTotalesPorDia`. */
  totalesPorDia: Record<string, number>;
  /** Define el título y el color de las barras. */
  tipo: "credito" | "debito";
}

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
 * Gráfico de barras secundario de `/mensual`: totales diarios de
 * créditos o débitos del mes seleccionado. Se usa dos veces en la
 * página (una por tipo), que también define el color y el título.
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
              tickFormatter={formatearCompacto}
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