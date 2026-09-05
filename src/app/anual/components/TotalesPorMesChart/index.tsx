"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./TotalesPorMesChart.module.css";
import { formatearCompacto, MESES_CORTOS } from "@/lib/format";
import ChartTooltip from "@/components/ChartTooltip";

interface TotalMesData {
  mes: string;
  total: number;
}

export interface TotalesPorMesChartProps {
  totalesPorMes: Record<string, number>;
  tipo: "credito" | "debito";
}

/** Colores por tipo */
const COLORES = {
  credito: { stroke: "#1D9E75", fill: "#1D9E7520" },
  debito:  { stroke: "#D85A30", fill: "#D85A3020" },
};

/** Títulos por tipo */
const TITULOS = {
  credito: "Créditos por mes",
  debito:  "Débitos por mes",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  tipo: "credito" | "debito";
}

function CustomTooltip({ active, payload, label, tipo }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <ChartTooltip
      title={label ?? ""}
      lines={[{ value: payload[0].value ?? 0, color: COLORES[tipo].stroke }]}
      size="secondary"
    />
  );
}

/**
 * TotalesPorMesChart
 *
 * Gráfico de área de `/anual`: totales mensuales de créditos o débitos.
 * Se usa dos veces (una por tipo), apilados en el panel derecho.
 */
export default function TotalesPorMesChart({ totalesPorMes, tipo }: TotalesPorMesChartProps) {
  const chartData: TotalMesData[] = Object.entries(totalesPorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, total]) => {
      const [, mm] = mes.split("-");
      return {
        mes: MESES_CORTOS[mm] ?? mes,
        total,
      };
    });

  const color = COLORES[tipo];

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{TITULOS[tipo]}</p>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`fill-${tipo}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color.stroke} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
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
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke={color.stroke}
              strokeWidth={1.5}
              fill={`url(#fill-${tipo})`}
              dot={false}
              activeDot={{ r: 4, fill: color.stroke, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}