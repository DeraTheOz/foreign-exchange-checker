import { Star } from "lucide-react";

interface ActionButtonsProps {
  isFavorited: boolean;
  isLogged: boolean;
  onFavorite: () => void;
  onLog: () => void;
}

export function ActionButtons({
  isFavorited,
  isLogged,
  onFavorite,
  onLog,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onFavorite}
        aria-pressed={isFavorited}
        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium leading-tight tracking-widest whitespace-nowrap  focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:ring-primary ${
          isFavorited
            ? "border-lime-500 bg-lime-500 text-neutral-900"
            : "border-neutral-400 bg-neutral-600 text-neutral-200"
        }`}>
        <Star
          className={`h-3.5 w-3.5 ${isFavorited ? "fill-neutral-900 text-neutral-900" : ""}`}
          aria-hidden
        />
        {isFavorited ? "FAVORITED" : "FAVORITE"}
      </button>

      <button
        type="button"
        onClick={onLog}
        disabled={isLogged}
        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium leading-tight tracking-widest whitespace-nowrap hover:bg-lime-800 hover:border-lime-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:border-lime-500 focus-visible:ring-primary ${
          isLogged
            ? "border-lime-500 bg-transparent text-white"
            : "border-neutral-400 bg-neutral-600 text-neutral-200"
        }`}>
        {isLogged ? "LOGGED" : "LOG CONVERSION"}
      </button>
    </div>
  );
}
