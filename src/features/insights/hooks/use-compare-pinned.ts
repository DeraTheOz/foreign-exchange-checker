import { useCallback } from "react";
import { useFavoritesStore } from "../store/favorites-store";

export function useComparePinned(base: string) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const isPinned = useCallback(
    (quote: string) => favorites.some((f) => f.from === base && f.to === quote),
    [favorites, base],
  );

  const toggle = useCallback(
    (quote: string) => toggleFavorite({ from: base, to: quote }),
    [toggleFavorite, base],
  );

  return { isPinned, toggle };
}