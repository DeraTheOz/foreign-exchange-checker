import { Star, History } from "lucide-react";

interface ActionButtonsProps {
  onFavorite: () => void;
  onLog: () => void;
}

export function ActionButtons({ onFavorite, onLog }: ActionButtonsProps) {
  const baseClass =
    "flex items-center justify-center gap-1.5 rounded-lg border border-neutral-400 px-3 py-2 text-xs font-medium leading-tight tracking-widest text-neutral-200 whitespace-nowrap";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onFavorite}
        className={`${baseClass} bg-neutral-600`}>
        <Star className="h-3.5 w-3.5" aria-hidden />
        FAVORITE
      </button>
      <button type="button" onClick={onLog} className={baseClass}>
        <History className="h-3.5 w-3.5" aria-hidden />
        LOG CONVERSION
      </button>
    </div>
  );
}
