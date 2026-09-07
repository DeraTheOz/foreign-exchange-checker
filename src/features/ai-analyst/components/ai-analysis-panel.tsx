import { useEffect, useState } from "react";
import { LoaderCircle, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useConverterStore } from "../../converter/store/converter-store";
import {
  RANGE_OPTIONS,
  useHistoricalRates,
  type HistoryRange,
} from "../../insights/hooks/use-historical-rates";
import { useHistoryData } from "../../insights/hooks/use-history-data";
import { formatRate } from "../../insights/utils/history-format";
import { EmptyState } from "../../../components/common/empty-state";
import { useAiAnalysis } from "../hooks/use-ai-analysis";
import { buildAnalysisPayload } from "../utils/build-analysis-payload";

export function AiAnalysisPanel() {
  const from = useConverterStore((state) => state.from);
  const to = useConverterStore((state) => state.to);
  const [range, setRange] = useState<HistoryRange>("1M");

  const { data: rates } = useHistoricalRates(from, to, range);
  const { stats } = useHistoryData(rates);
  const ai = useAiAnalysis();
  const resetAnalysis = ai.reset;

  useEffect(() => {
    resetAnalysis();
  }, [from, to, range, resetAnalysis]);

  const headingId = "ai-analysis-title";
  const canAnalyse = rates != null && stats != null && rates.length >= 2;

  const handleAnalyse = () => {
    if (!canAnalyse) {
      return;
    }
    ai.mutate(
      buildAnalysisPayload(
        from,
        to,
        range,
        rates,
        stats.open,
        stats.last,
        stats.pct,
      ),
    );
  };

  if (from === to) {
    return (
      <EmptyState
        title="Select two currencies"
        description="Choose different SEND and RECEIVE currencies to generate an AI analysis of their rate history."
      />
    );
  }

  return (
    <section className="mt-5 flex flex-col gap-5" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        AI analysis for {from}/{to}
      </h2>

      <div className="flex flex-col gap-5 min-[980px]:flex-row min-[980px]:items-center min-[980px]:justify-between">
        <p className="m-0 text-sm leading-tight tracking-widest text-neutral-200">
          {from}/{to} · {range} ·{" "}
          {stats
            ? `${stats.direction === "up" ? "▲" : "▼"} ${stats.change >= 0 ? "+" : "−"}${Math.abs(stats.pct).toFixed(2)}% (${formatRate(stats.last)})`
            : "Loading rate history…"}
        </p>

        <div
          className="flex w-max rounded-lg bg-neutral-700 p-0.5"
          role="group"
          aria-label="Analysis range">
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

      <button
        type="button"
        onClick={handleAnalyse}
        disabled={!canAnalyse || ai.isPending}
        className={`flex min-h-11 items-center justify-center gap-3 rounded-2xl bg-primary px-5 text-sm leading-tight tracking-widest text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:opacity-50 ${
          ai.isPending || !canAnalyse ? "cursor-not-allowed" : "cursor-pointer"
        }`}>
        {ai.isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4" aria-hidden="true" />
        )}
        {ai.isPending
          ? `Analyzing ${from}/${to} over the last ${range.toLowerCase()}…`
          : `Generate AI analysis for ${from}/${to}`}
      </button>

      <div aria-live="polite">
        {ai.isError && (
          <div
            className="rounded-2xl border border-neutral-600 bg-neutral-700 p-5 text-sm leading-relaxed text-error"
            role="alert">
            {ai.error instanceof Error
              ? ai.error.message
              : "The AI analyst could not complete the analysis."}
          </div>
        )}

        {ai.data && (
          <div className="flex flex-col gap-5">
            <article className="rounded-2xl border border-neutral-600 bg-neutral-700 p-5">
              <header className="flex items-center gap-2">
                {stats && stats.direction === "down" ? (
                  <TrendingDown
                    className="size-4 text-error"
                    aria-hidden="true"
                  />
                ) : (
                  <TrendingUp
                    className="size-4 text-success"
                    aria-hidden="true"
                  />
                )}
                <h3 className="m-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
                  TREND SUMMARY
                </h3>
              </header>
              <p className="m-0 mt-4 text-sm leading-relaxed text-neutral-100">
                {ai.data.trendSummary}
              </p>
            </article>

            <article className="rounded-2xl border border-neutral-600 bg-neutral-700 p-5">
              <header className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                <h3 className="m-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
                  KEY INSIGHT
                </h3>
              </header>
              <p className="m-0 mt-4 text-sm leading-relaxed text-neutral-100">
                {ai.data.keyInsight}
              </p>
            </article>

            <p className="m-0 text-xs leading-tight tracking-widest text-neutral-200">
              Analysis is based on historical data only and is not financial
              advice.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
