"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./BalanceAnualChart.module.css";

/**
 * Entrada de dato para el gráfico.
 * Se construye a partir del resultado de `calcularBalancePorMes`.
 */
interface BalanceMesData {
  /** Mes en formato corto: "Ene", "Feb", etc. */
  mes: string;
  /** Balance neto del mes (puede ser negativo) */
  balance: number;
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
}

/**
 * Props del tooltip personalizado.
 * Se tipan manualmente para evitar incompatibilidades entre versiones de recharts.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}

/** Nombres cortos de los meses para el eje X */
const MESES_CORTOS: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
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
 * Tooltip personalizado para el gráfico de balance.
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const valor = payload[0].value ?? 0;
  const esPositivo = valor >= 0;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={`${styles.tooltipValue} ${esPositivo ? styles.positivo : styles.negativo}`}>
        {formatearMoneda(valor)}
      </p>
    </div>
  );
}

/**
 * BalanceAnualChart
 *
 * Gráfico de barras que muestra el balance neto mensual a lo largo del año.
 * Las barras positivas se muestran en verde y las negativas en rojo.
 *
 * Recibe directamente el resultado de `calcularBalancePorMes` del
 * `MultiMonthController` y lo transforma internamente al formato
 * que necesita Recharts.
 *
 * @example
 * ```tsx
 * // app/anual/page.tsx
 * const balancePorMes = calcularBalancePorMes(data);
 *
 * <BalanceAnualChart balancePorMes={balancePorMes} />
 * ```
 */
export default function BalanceAnualChart({ balancePorMes }: BalanceAnualChartProps) {
  const chartData: BalanceMesData[] = Object.entries(balancePorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, balance]) => {
      const [, mm] = mes.split("-");
      return {
        mes: MESES_CORTOS[mm] ?? mes,
        balance,
      };
    });

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Balance por mes</p>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              tickFormatter={(v) =>
                new Intl.NumberFormat("es-AR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--surface)" }}
            />
            <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.balance >= 0 ? "#1D9E75" : "#D85A30"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}