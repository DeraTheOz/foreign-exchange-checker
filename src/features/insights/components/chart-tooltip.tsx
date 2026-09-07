import { formatRate } from "../utils/history-format";

interface ChartTooltipState {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    payload?: Record<string, unknown>;
    value?: number | string | Array<number | string>;
  }>;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipState) {
  if (!active || !payload?.length) return null;

  const datum = payload[0]?.payload;
  const dateLabel =
    typeof datum?.fullDate === "string" ? datum.fullDate : (label ?? "");

  const value = payload[0]?.value;
  const formatted =
    typeof value === "number"
      ? formatRate(value)
      : typeof value === "string"
        ? value
        : Array.isArray(value) && typeof value[0] === "number"
          ? formatRate(value[0])
          : "—";

  return (
    <div className="rounded-lg border border-neutral-500 bg-neutral-600 px-3 py-2 text-xs leading-tight tracking-widest text-neutral-50">
      <p className="m-0 opacity-70">{dateLabel ?? ""}</p>
      <p className="m-0 mt-1 text-primary">{formatted}</p>
    </div>
  );
}
