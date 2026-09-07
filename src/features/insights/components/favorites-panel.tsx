import { ArrowRight, Star } from "lucide-react";
import { useFavoritesStore } from "../store/favorites-store";
import { useFavoriteRates } from "../hooks/use-favorite-rates";
import { useConverterStore } from "../../converter/store/converter-store";
import { formatNumber } from "../../../lib/format-number";
import { EmptyState } from "../../../components/common/empty-state";

export function FavoritesPanel() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const favoriteRates = useFavoriteRates();
  const setPair = useConverterStore((s) => s.setPair);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No pinned pairs yet"
        description="Pin a pair to track its rate here. Tap the star icon on any conversation or comparison row."
      />
    );
  }

  return (
    <section
      className="mt-5 rounded-2xl bg-neutral-700 p-4 min-[720px]:p-5"
      aria-labelledby="favorites-title">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="favorites-title"
          className="m-0 text-base font-medium leading-tight tracking-widest text-neutral-50">
          Pinned pairs
        </h2>
        <p className="m-0 shrink-0 text-xs leading-tight tracking-widest text-neutral-50 opacity-70">
          {favorites.length} favorites
        </p>
      </header>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {favoriteRates.map((fav) => (
          <li
            key={`${fav.from}-${fav.to}`}
            className="rounded-[10px] border border-neutral-500 bg-neutral-600 hover:border-neutral-100/50 transition">
            <div
              className="flex min-h-13 cursor-pointer items-center gap-3 px-4 py-3 min-[640px]:gap-5"
              onClick={() => setPair(fav.from, fav.to)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPair(fav.from, fav.to);
                }
              }}>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="text-sm leading-tight tracking-widest text-neutral-50">
                  {fav.from}
                </span>
                <ArrowRight
                  className="size-3 shrink-0 text-neutral-200"
                  aria-hidden
                />
                <span className="text-sm leading-tight tracking-widest text-neutral-50">
                  {fav.to}
                </span>
              </div>

              <div className="shrink-0 text-right">
                <p className="m-0 text-base leading-tight tracking-widest text-neutral-50">
                  {fav.isLoading ? "—" : formatNumber(fav.rate)}
                </p>
                <p
                  className={`mt-1.5 mb-0 text-[10px] leading-none ${
                    fav.direction === "up" ? "text-success" : "text-error"
                  }`}>
                  {fav.direction === "up" ? "▲" : "▼"} {fav.change}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite({ from: fav.from, to: fav.to });
                }}
                aria-pressed="true"
                aria-label={`Remove ${fav.from} to ${fav.to} from favorites`}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Star
                  className="size-4 fill-primary text-primary"
                  aria-hidden
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
