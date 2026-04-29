import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import { useClientAuth } from "./use-client-auth";

const LS_KEY = "kururent_favorites";

function getLSFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function setLSFavorites(ids: string[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(ids)); } catch {}
}

export function useFavorites() {
  const { isAuthenticated } = useClientAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites on mount / auth change
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.get("/favorites")
        .then((res) => {
          const ids = (res.data?.favorites || []).map((f: any) => f.propertyId).filter(Boolean);
          setFavorites(ids);
          setLSFavorites(ids);
        })
        .catch(() => setFavorites(getLSFavorites()))
        .finally(() => setLoading(false));
    } else {
      setFavorites(getLSFavorites());
    }
  }, [isAuthenticated]);

  const isFavorited = useCallback((propertyId: string) => favorites.includes(propertyId), [favorites]);

  const toggle = useCallback(async (propertyId: string) => {
    const wasFav = favorites.includes(propertyId);
    // Optimistic update
    const next = wasFav ? favorites.filter((id) => id !== propertyId) : [...favorites, propertyId];
    setFavorites(next);
    setLSFavorites(next);

    if (isAuthenticated) {
      try {
        if (wasFav) {
          await api.delete("/favorites", { data: { propertyId } });
        } else {
          await api.post("/favorites", { propertyId });
        }
      } catch {
        // Revert on error
        setFavorites(favorites);
        setLSFavorites(favorites);
      }
    }
  }, [favorites, isAuthenticated]);

  return { favorites, isFavorited, toggle, loading };
}
