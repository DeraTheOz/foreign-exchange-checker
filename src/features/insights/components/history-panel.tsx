import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useConverterStore } from "../../converter/store/converter-store";
import {
  useHistoricalRates,
  RANGE_OPTIONS,
  type HistoryRange,
} from "../hooks/use-historical-rates";
import { useHistoryData } from "../hooks/use-history-data";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";
import {
  formatRate,
  formatAxisDate,
  formatAxisYear,
  formatHeaderDate,
} from "../utils/history-format";
import { EmptyState } from "../../../components/common/empty-state";
import { ChartTooltip } from "./chart-tooltip";

const PRIMARY_COLOR = "#cef739";
const GRID_COLOR = "#2e2e2e";
const AXIS_LABEL_COLOR = "#9d9d9d";
const CURSOR_COLOR = "#454547";

export function HistoryPanel() {
  const from = useConverterStore((s) => s.from);
  const to = useConverterStore((s) => s.to);
  const [range, setRange] = useState<HistoryRange>("1M");
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data: rates, isLoading, error } = useHistoricalRates(from, to, range);
  const { stats, chartData, chartScale, hasChart } = useHistoryData(rates);

  const headingId = "history-title";

  const formatAxisLabel = (date: string) =>
    range === "5Y" ? formatAxisYear(date) : formatAxisDate(date);

  if (from === to) {
    return (
      <EmptyState
        title="Select two currencies"
        description="Choose different SEND and RECEIVE currencies to view their rate history."
      />
    );
  }

  if (error || (rates && !hasChart)) {
    return (
      <EmptyState
        title="No chart data available"
        description={`We couldn't load rate history for ${from}/${to} right now. This usually clears up in a minute.`}
      />
    );
  }

  const lastDate = rates?.[rates.length - 1]?.date ?? "";

  return (
    <section className="mt-5 flex flex-col gap-5" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {from}/{to} history
      </h2>

      <div className="flex flex-col gap-5 min-[980px]:flex-row min-[980px]:items-center min-[980px]:justify-between">
        <div className="grid grid-cols-2 gap-3 min-[600px]:flex min-[600px]:gap-4">
          {[
            {
              label: "OPEN",
              value: stats ? formatRate(stats.open) : "—",
              negative: false,
            },
            {
              label: "LAST",
              value: stats ? formatRate(stats.last) : "—",
              negative: false,
            },
            {
              label: "CHANGE",
              value: stats
                ? `${stats.change >= 0 ? "+" : "−"}${formatRate(Math.abs(stats.change))}`
                : "—",
              negative: stats ? stats.direction === "down" : false,
            },
            {
              label: "% CHANGE",
              value: stats
                ? `${stats.direction === "up" ? "▲" : "▼"} ${stats.change >= 0 ? "+" : "−"}${Math.abs(stats.pct).toFixed(2)}%`
                : "—",
              negative: stats ? stats.direction === "down" : false,
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="flex min-h-18 flex-col justify-center gap-3 rounded-2xl border border-neutral-600 bg-neutral-700 px-4 py-3 min-[600px]:w-35 min-[600px]:px-5">
              <p className="m-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
                {stat.label}
              </p>
              <p
                className={`m-0 text-xl leading-tight tracking-normal ${
                  stat.negative
                    ? "text-error"
                    : stat.value !== "—"
                      ? "text-success"
                      : "text-neutral-50"
                }`}>
                {stat.value}
              </p>
            </article>
          ))}
        </div>

        <div
          className="flex w-max rounded-lg bg-neutral-700 p-0.5"
          role="group"
          aria-label="History range">
          {RANGE_OPTIONS.map((option) => {
            const isActive = option === range;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={isActive}
                className={`min-h-10 rounded-lg px-3 text-xs leading-tight tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-[460px]:px-4 ${
                  isActive
                    ? "bg-neutral-500 text-neutral-50"
                    : "bg-transparent text-neutral-200"
                }`}>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <article
        className="rounded-2xl border border-neutral-600 bg-neutral-700 p-4 min-[720px]:p-5"
        aria-labelledby="history-chart-title">
        <div className="flex flex-col gap-2 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
          <h3
            id="history-chart-title"
            className="m-0 text-base font-medium leading-tight tracking-widest text-neutral-50">
            {from}/{to}
          </h3>
          <p className="m-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
            {stats && lastDate
              ? `${formatRate(stats.last)} · ${formatHeaderDate(lastDate)}`
              : "Loading…"}
          </p>
        </div>

        <p className="sr-only">
          {stats && chartScale
            ? `${from}/${to} ${range.toLowerCase()} chart from ${formatAxisLabel(
                chartScale.xTicks[0],
              )} to ${formatAxisLabel(
                chartScale.xTicks[chartScale.xTicks.length - 1],
              )}. The rate opened at ${formatRate(
                stats.open,
              )} and last traded at ${formatRate(stats.last)}.`
            : `Loading ${from}/${to} ${range.toLowerCase()} chart.`}
        </p>

        {hasChart && chartScale ? (
          <div key={range} className="chart-enter mt-5" aria-hidden="true">
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart
                data={chartData}
                margin={{ top: 18, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient
                    id="historyChartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop
                      offset="0%"
                      stopColor={PRIMARY_COLOR}
                      stopOpacity={0.68}
                    />
                    <stop
                      offset="100%"
                      stopColor={PRIMARY_COLOR}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={GRID_COLOR}
                  strokeDasharray="2 4"
                  strokeOpacity={0.75}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  type="category"
                  ticks={chartScale.xTicks}
                  tickLine={false}
                  axisLine={false}
                  height={28}
                  tickMargin={6}
                  tick={{ fontSize: 10, fill: AXIS_LABEL_COLOR }}
                  tickFormatter={(value) =>
                    typeof value === "string"
                      ? formatAxisLabel(value)
                      : String(value)
                  }
                />
                <YAxis
                  type="number"
                  orientation="left"
                  domain={[chartScale.chartMin, chartScale.chartMax]}
                  ticks={chartScale.yTicks}
                  tickFormatter={formatRate}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fontSize: 10, fill: AXIS_LABEL_COLOR }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: CURSOR_COLOR, strokeDasharray: "2 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke={PRIMARY_COLOR}
                  strokeWidth={2}
                  fill="url(#historyChartFill)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: PRIMARY_COLOR,
                    stroke: "#171719",
                    strokeWidth: 2,
                  }}
                  animationDuration={900}
                  animationEasing="ease-out"
                  isAnimationActive={!prefersReducedMotion}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-5 text-xs leading-tight tracking-widest text-neutral-200">
            {isLoading ? "Loading rate history…" : "No data for this range."}
          </p>
        )}
      </article>
    </section>
  );
}
