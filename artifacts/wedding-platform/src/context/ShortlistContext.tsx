import { createContext, useContext, useState, useEffect } from "react";

export interface ShortlistItem {
  id: string;
  type: "venue" | "vendor";
  name: string;
  city?: string;
  category?: string;
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  add: (item: ShortlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: ShortlistItem) => void;
  has: (id: string) => boolean;
  count: number;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("bms_shortlist") || "[]") as ShortlistItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bms_shortlist", JSON.stringify(items));
  }, [items]);

  const add = (item: ShortlistItem) =>
    setItems(prev => [...prev.filter(i => i.id !== item.id), item]);

  const remove = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const toggle = (item: ShortlistItem) =>
    items.some(i => i.id === item.id) ? remove(item.id) : add(item);

  const has = (id: string) => items.some(i => i.id === id);

  return (
    <ShortlistContext.Provider value={{ items, add, remove, toggle, has, count: items.length }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be inside ShortlistProvider");
  return ctx;
}
