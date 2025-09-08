import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { foodSuggestions } from '../data/foodSuggestions';
import { FoodSuggestion } from '../types';

const STORAGE_KEY = 'moodbites:favorites:v1';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as string[];
          setFavoriteIds(parsed);
        }
      } catch (e) {
        console.warn('Failed to load favorites', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Persist when changed
  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
      } catch (e) {
        console.warn('Failed to save favorites', e);
      }
    })();
  }, [favoriteIds, loading]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const add = useCallback((id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => {
    setFavoriteIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const favorites: FoodSuggestion[] = useMemo(() => {
    const map = new Map(foodSuggestions.map((s) => [s.id, s] as const));
    return favoriteIds.map((id) => map.get(id)).filter(Boolean) as FoodSuggestion[];
  }, [favoriteIds]);

  return { favoriteIds, favorites, isFavorite, add, remove, toggle, loading };
}
