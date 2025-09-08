import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GroceryItem = {
  id: string; // suggestionId:ingredientIndex or uuid
  title: string;
  checked: boolean;
};

const STORAGE_KEY = 'moodbites:grocery-list:v1';

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load grocery list', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save grocery list', e);
      }
    })();
  }, [items, loading]);

  const addMany = useCallback((titles: string[], suggestionId?: string) => {
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.title.toLowerCase()));
      const newItems: GroceryItem[] = [];
      titles.forEach((t, idx) => {
        const key = t.trim();
        if (!key) return;
        if (!existing.has(key.toLowerCase())) {
          newItems.push({ id: `${suggestionId ?? 'manual'}:${idx}:${key}`.slice(0, 80), title: key, checked: false });
        }
      });
      return [...prev, ...newItems];
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((i) => !i.checked));
  }, []);

  return { items, loading, addMany, toggle, remove, clearChecked };
}
