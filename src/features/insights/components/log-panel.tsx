import {
  useConversionHistory,
  type ConversionEntry,
} from "../store/conversion-history-store";
import { EmptyState } from "../../../components/common/empty-state";
import { LogRow } from "./log-row";

export function LogPanel() {
  const entries = useConversionHistory((s) => s.entries);
  const removeEntry = useConversionHistory((s) => s.removeEntry);
  const clearAll = useConversionHistory((s) => s.clearAll);

  if (entries.length === 0) {
    return (
      <EmptyState
        title="No conversions logged yet"
        description="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
      />
    );
  }

  return (
    <section
      className="mt-5 rounded-2xl bg-neutral-700 p-4 min-[720px]:p-5"
      aria-labelledby="log-title">
      <header className="mb-4 flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
        <h2
          id="log-title"
          className="m-0 text-base font-medium leading-tight tracking-widest text-neutral-50">
          Conversion log
        </h2>
        <div className="flex items-center gap-4">
          <p className="m-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
            {entries.length} logged
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-neutral-400 bg-neutral-600 px-3 py-2 text-xs leading-tight tracking-wider text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Clear all
          </button>
        </div>
      </header>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {entries.map((entry: ConversionEntry) => (
          <LogRow key={entry.id} entry={entry} onDelete={removeEntry} />
        ))}
      </ul>
    </section>
  );
}
