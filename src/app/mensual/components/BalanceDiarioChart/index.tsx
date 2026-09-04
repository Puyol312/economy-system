"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styles from "./BalanceDiarioChart.module.css";
import { formatearMoneda, extraerDia, formatearCompacto } from "@/lib/format";

interface BalanceDiaData {
  dia: string;
  balance: number;
}

export interface BalanceDiarioChartProps {
  /** Balance por día proveniente de `calcularBalancePorDia`. */
  balancePorDia: Record<string, number>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const valor = payload[0].value ?? 0;
  const esPositivo = valor >= 0;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>Día {label}</p>
      <p className={`${styles.tooltipValue} ${esPositivo ? styles.positivo : styles.negativo}`}>
        {formatearMoneda(valor)}
      </p>
    </div>
  );
}

/**
 * BalanceDiarioChart
 *
 * Gráfico de área principal de la página `/mensual`: evolución del
 * balance día a día del mes seleccionado, con línea de referencia en 0.
 */
export default function BalanceDiarioChart({
  balancePorDia,
}: BalanceDiarioChartProps) {
  const chartData: BalanceDiaData[] = Object.entries(balancePorDia)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, balance]) => ({
      dia: extraerDia(dia),
      balance,
    }));

  const valores = Object.values(balancePorDia);
  const hayNegativos = valores.some((v) => v < 0);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Balance diario</p>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fill-balance-diario" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              tickFormatter={formatearCompacto}
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            {hayNegativos && (
              <ReferenceLine
                y={0}
                stroke="var(--border)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#1D9E75"
              strokeWidth={1.5}
              fill="url(#fill-balance-diario)"
              dot={false}
              activeDot={{ r: 4, fill: "#1D9E75", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}