import { ArrowRight, Trash2 } from "lucide-react";
import { relativeTime } from "../utils/relative-time";
import type { ConversionEntry } from "../store/conversion-history-store";

export function LogRow({
  entry,
  onDelete,
}: {
  entry: ConversionEntry;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="rounded-[10px] border border-neutral-500 bg-neutral-600">
      <div className="flex min-h-13 items-center gap-2.5 p-3 min-[760px]:grid min-[760px]:grid-cols-[4rem_minmax(0,1fr)_minmax(14rem,max-content)_2rem] min-[760px]:gap-4 min-[760px]:px-4 min-[760px]:py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1 min-[760px]:contents">
          <p className="m-0 text-sm leading-tight tracking-widest text-neutral-200">
            {relativeTime(entry.timestamp)}
          </p>

          <div className="flex min-w-0 items-center gap-2">
            <span className="text-sm leading-tight tracking-widest text-neutral-50">
              {entry.from}
            </span>
            <ArrowRight
              className="size-3 shrink-0 text-neutral-200"
              aria-hidden
            />
            <span className="text-sm leading-tight tracking-widest text-neutral-50">
              {entry.to}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5 text-right text-base leading-tight tracking-widest min-[760px]:flex-row min-[760px]:gap-5 min-[760px]:ml-auto">
          <span className="text-neutral-100">{entry.amount}</span>
          <span className="text-primary">{entry.converted}</span>
        </div>

        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          aria-label={`Delete ${entry.from} to ${entry.to} conversion`}
          className="flex size-8 shrink-0 items-center justify-center justify-self-end rounded-lg border border-neutral-500 bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Trash2 className="size-4 text-neutral-50" aria-hidden />
        </button>
      </div>
    </li>
  );
}
