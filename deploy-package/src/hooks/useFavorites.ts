import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/cache';
import { FavoriteCurrency } from '@/types';

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (code: string) => boolean;
  addFavorite: (code: string) => void;
  removeFavorite: (code: string) => void;
  toggleFavorite: (code: string) => void;
  clearFavorites: () => void;
}

/**
 * Custom hook for managing favorite currencies
 */
export function useFavorites(): UseFavoritesReturn {
  const [favoritesData, setFavoritesData] = useLocalStorage<FavoriteCurrency[]>(
    STORAGE_KEYS.favorites,
    []
  );

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(favoritesData.map((fav) => fav.code));
  }, [favoritesData]);

  const isFavorite = (code: string): boolean => {
    return favorites.includes(code);
  };

  const addFavorite = (code: string): void => {
    if (!isFavorite(code)) {
      const newFavorite: FavoriteCurrency = {
        code,
        addedAt: Date.now(),
      };
      setFavoritesData([...favoritesData, newFavorite]);
    }
  };

  const removeFavorite = (code: string): void => {
    setFavoritesData(favoritesData.filter((fav) => fav.code !== code));
  };

  const toggleFavorite = (code: string): void => {
    if (isFavorite(code)) {
      removeFavorite(code);
    } else {
      addFavorite(code);
    }
  };

  const clearFavorites = (): void => {
    setFavoritesData([]);
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
