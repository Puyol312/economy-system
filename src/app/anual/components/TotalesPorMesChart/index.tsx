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

/**
 * Entrada de dato para el gráfico.
 * Se construye a partir del resultado de `obtenerTotalesPorMes`.
 */
interface TotalMesData {
  mes: string;
  total: number;
}

/**
 * TotalesPorMesChartProps
 */
export interface TotalesPorMesChartProps {
  /**
   * Record de totales por mes proveniente de `obtenerTotalesPorMes`.
   * @example { "2026-01": 60000, "2026-02": 45000 }
   */
  totalesPorMes: Record<string, number>;

  /**
   * Tipo de movimiento que representa el gráfico.
   * Define el título y el color del área.
   */
  tipo: "credito" | "debito";
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
 * Tooltip personalizado para el gráfico de totales.
 */
function CustomTooltip({ active, payload, label, tipo }: CustomTooltipProps & { tipo: "credito" | "debito" }) {
  if (!active || !payload?.length) return null;

  const valor = payload[0].value ?? 0;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p
        className={styles.tooltipValue}
        style={{ color: COLORES[tipo].stroke }}
      >
        {formatearMoneda(valor)}
      </p>
    </div>
  );
}

/**
 * TotalesPorMesChart
 *
 * Gráfico de área que muestra los totales mensuales de créditos o débitos.
 * Es reutilizable: el `tipo` define tanto el color como el título.
 *
 * Recibe directamente el resultado de `obtenerTotalesPorMes` del
 * `MultiMonthController`.
 *
 * Se usa dos veces en `/anual`, una para créditos y otra para débitos,
 * apilados verticalmente en el panel derecho.
 *
 * @example
 * ```tsx
 * // app/anual/page.tsx
 * const creditosPorMes = obtenerTotalesPorMes(data, "credito");
 * const debitosPorMes  = obtenerTotalesPorMes(data, "debito");
 *
 * <TotalesPorMesChart totalesPorMes={creditosPorMes} tipo="credito" />
 * <TotalesPorMesChart totalesPorMes={debitosPorMes}  tipo="debito" />
 * ```
 */
export default function TotalesPorMesChart({
  totalesPorMes,
  tipo,
}: TotalesPorMesChartProps) {
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