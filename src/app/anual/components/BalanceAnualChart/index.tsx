"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import styles from "./BalanceAnualChart.module.css";
import { formatearMoneda, formatearCompacto, MESES_CORTOS } from "@/lib/format";
/**
 * Entrada de dato para el gráfico.
 */
interface BalanceMesData {
  mes:            string;
  balance:        number;
  saldoAcumulado: number;
}

/**
 * BalanceAnualChartProps
 */
export interface BalanceAnualChartProps {
  /**
   * Record de balance por mes proveniente de `calcularBalancePorMes`.
   * @example { "2026-01": 30000, "2026-02": -5000 }
   */
  balancePorMes: Record<string, number>;

  /**
   * Record de saldo acumulado por mes proveniente de `calcularSaldoAcumulado`.
   * @example { "2026-01": 30000, "2026-02": 25000 }
   */
  saldoAcumulado: Record<string, number>;
}

/**
 * Props del tooltip personalizado.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number; name?: string; color?: string }[];
  label?: string;
}

/**
 * Tooltip personalizado para el gráfico combinado.
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className={styles.tooltipValue}
          style={{ color: entry.color }}
        >
          {entry.name === "balance" ? "Balance del mes" : "Saldo acumulado"}
          {": "}
          {formatearMoneda(entry.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

/**
 * BalanceAnualChart
 *
 * Gráfico combinado que muestra:
 * - Barras: balance neto mensual (verde positivo, rojo negativo).
 * - Línea: saldo acumulado mes a mes en violeta.
 *
 * Recibe directamente los resultados de `calcularBalancePorMes`
 * y `calcularSaldoAcumulado` del endpoint `/api/reportes/anual`.
 *
 * @example
 * ```tsx
 * <BalanceAnualChart
 *   balancePorMes={reporte.balancePorMes}
 *   saldoAcumulado={reporte.saldoAcumulado}
 * />
 * ```
 */
export default function BalanceAnualChart({
  balancePorMes,
  saldoAcumulado,
}: BalanceAnualChartProps) {
  const chartData: BalanceMesData[] = Object.keys(balancePorMes)
    .sort()
    .map((mes) => {
      const [, mm] = mes.split("-");
      return {
        mes:            MESES_CORTOS[mm] ?? mes,
        balance:        balancePorMes[mes],
        saldoAcumulado: saldoAcumulado[mes] ?? 0,
      };
    });

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Balance por mes</p>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="35%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
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
              cursor={{ fill: "var(--surface)" }}
            />
            <Legend
              formatter={(value) =>
                value === "balance" ? "Balance del mes" : "Saldo acumulado"
              }
              wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
            />
            <Bar dataKey="balance" radius={[4, 4, 0, 0]} name="balance">
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.balance >= 0 ? "#1D9E75" : "#D85A30"}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="saldoAcumulado"
              name="saldoAcumulado"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}