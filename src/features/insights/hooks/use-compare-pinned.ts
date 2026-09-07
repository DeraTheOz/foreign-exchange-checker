import { useCallback } from "react";
import { useFavoritesStore } from "../store/favorites-store";

export function useComparePinned(base: string) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const isPinned = useCallback(
    (quote: string) => favorites.some((f) => f.to === quote),
    [favorites],
  );

  const toggle = useCallback(
    (quote: string) => {
      const existing = favorites.filter((f) => f.to === quote);
      if (existing.length > 0) {
        existing.forEach((pair) => removeFavorite(pair));
      } else {
        addFavorite({ from: base, to: quote });
      }
    },
    [favorites, addFavorite, removeFavorite, base],
  );

  return { isPinned, toggle };
}