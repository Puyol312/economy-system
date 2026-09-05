import { formatearMoneda } from "@/lib/format";
import styles from "./ChartTooltip.module.css";

export interface ChartTooltipLine {
  value: number;
  color: string;
  /** Prefijo opcional antes del monto, ej. "Balance del mes: ". */
  label?: string;
}

export interface ChartTooltipProps {
  /** Primera línea del tooltip (día, mes, etc. según el gráfico). */
  title: string;
  lines: ChartTooltipLine[];
  size?: "main" | "secondary";
}

/**
 * ChartTooltip
 *
 * Tooltip compartido por los 4 gráficos de `/mensual` y `/anual`.
 * `size` controla el padding y tamaño de fuente: los gráficos
 * principales (BalanceDiarioChart, BalanceAnualChart) usan "main",
 * los secundarios (TotalesPorDiaChart, TotalesPorMesChart) usan
 * "secondary". Ambas variantes ya existían idénticas en los 4
 * módulos CSS originales.
 */
export default function ChartTooltip({
  title,
  lines,
  size = "main",
}: ChartTooltipProps) {
  return (
    <div className={`${styles.tooltip} ${size === "secondary" ? styles.secondary : ""}`}>
      <p className={styles.tooltipLabel}>{title}</p>
      {lines.map((line, i) => (
        <p key={i} className={styles.tooltipValue} style={{ color: line.color }}>
          {line.label}
          {formatearMoneda(line.value)}
        </p>
      ))}
    </div>
  );
}