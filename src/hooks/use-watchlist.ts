import { useEffect, useState, useCallback } from "react";
import { watchlist } from "@/lib/watchlist";

export function useWatchlist() {
  const [items, setItems] = useState<Set<string>>(() => watchlist.get());

  useEffect(() => {
    const unsub = watchlist.subscribe(setItems);
    return () => {
      unsub();
    };
  }, []);

  const toggle = useCallback((id: string) => watchlist.toggle(id), []);
  const has = useCallback((id: string) => items.has(id), [items]);

  return { items, count: items.size, toggle, has };
}
