import { createContext, useContext, useState } from "react";
import type { VendorLike } from "@/components/VendorDetailModal";

interface ComparisonContextValue {
  items: VendorLike[];
  add: (v: VendorLike) => void;
  remove: (name: string) => void;
  clear: () => void;
  has: (name: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextValue | null>(null);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<VendorLike[]>([]);

  const add = (v: VendorLike) =>
    setItems(prev => {
      if (prev.length >= 3 || prev.some(x => x.name === v.name)) return prev;
      return [...prev, v];
    });

  const remove = (name: string) => setItems(prev => prev.filter(x => x.name !== name));
  const clear = () => setItems([]);
  const has = (name: string) => items.some(x => x.name === name);

  return (
    <ComparisonContext.Provider value={{ items, add, remove, clear, has }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used within ComparisonProvider");
  return ctx;
}
