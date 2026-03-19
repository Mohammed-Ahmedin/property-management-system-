import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Property } from "../types/property.type";

interface FavoritesState {
  favorites: Property[];
  isLoading: boolean;
  addFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  toggleFavorite: (property: Property) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,

      addFavorite: (property: Property) => {
        set((state) => {
          const exists = state.favorites.some(
            (fav) => fav.id === property.id
          );
          if (exists) return state;

          return {
            favorites: [...state.favorites, property],
          };
        });
      },

      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      isFavorite: (id: string) => {
        return get().favorites.some((fav) => fav.id === id);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      toggleFavorite: (property: Property) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(property.id)) {
          removeFavorite(property.id);
        } else {
          addFavorite(property);
        }
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
