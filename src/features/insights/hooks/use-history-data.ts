import { useMemo } from "react";
import type { FrankfurterRate } from "../../../types/frankfurter";
import { formatTooltipDate } from "../utils/history-format";

export interface HistoryStats {
  open: number;
  last: number;
  change: number;
  pct: number;
  direction: "up" | "down";
}

export interface HistoryChartScale {
  chartMin: number;
  chartMax: number;
  yTicks: number[];
  xTicks: string[];
}

export function useHistoryData(rates: FrankfurterRate[] | undefined) {
  const stats = useMemo<HistoryStats | null>(() => {
    const first = rates?.[0]?.rate;
    const last = rates?.[rates.length - 1]?.rate;
    if (first == null || last == null) return null;

    const change = last - first;
    const pct = (change / first) * 100;
    return {
      open: first,
      last,
      change,
      pct,
      direction: pct >= 0 ? ("up" as const) : ("down" as const),
    };
  }, [rates]);

  const chartData = useMemo(
    () =>
      (rates ?? []).map((rate) => ({
        date: rate.date,
        fullDate: formatTooltipDate(rate.date),
        rate: rate.rate,
      })),
    [rates],
  );

  const chartScale = useMemo<HistoryChartScale | null>(() => {
    if (!rates || rates.length < 2) return null;

    const values = rates.map((rate) => rate.rate);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = (rawMax - rawMin) * 0.15 || rawMax * 0.01 || 1;
    const chartMin = rawMin - pad;
    const chartMax = rawMax + pad;

    const yTicks = [chartMax, (chartMax + chartMin) / 2, chartMin];
    const xTicks = [0, 0.25, 0.5, 0.75, 1].map((t) =>
      rates[Math.round(t * (rates.length - 1))].date,
    );

    return { chartMin, chartMax, yTicks, xTicks };
  }, [rates]);

  const hasChart = chartData.length >= 2 && chartScale !== null;

  return { stats, chartData, chartScale, hasChart };
}