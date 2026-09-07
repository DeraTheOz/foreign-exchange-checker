import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoritePair {
  from: string;
  to: string;
}

interface FavoritesState {
  favorites: FavoritePair[];
  addFavorite: (pair: FavoritePair) => void;
  removeFavorite: (pair: FavoritePair) => void;
  toggleFavorite: (pair: FavoritePair) => void;
  isFavorited: (pair: FavoritePair) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (pair) =>
        set((state) => {
          const exists = state.favorites.some(
            (f) => f.from === pair.from && f.to === pair.to,
          );
          if (exists) return state;
          return { favorites: [pair, ...state.favorites] };
        }),

      removeFavorite: (pair) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.from === pair.from && f.to === pair.to),
          ),
        })),

      toggleFavorite: (pair) => {
        const { favorites } = get();
        const exists = favorites.some(
          (f) => f.from === pair.from && f.to === pair.to,
        );
        if (exists) {
          set({
            favorites: favorites.filter(
              (f) => !(f.from === pair.from && f.to === pair.to),
            ),
          });
        } else {
          set({ favorites: [pair, ...favorites] });
        }
      },

      isFavorited: (pair) =>
        get().favorites.some(
          (f) => f.from === pair.from && f.to === pair.to,
        ),
    }),
    { name: "fx-favorites" },
  ),
);
