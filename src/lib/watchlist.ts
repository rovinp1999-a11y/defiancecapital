/**
 * Tiny localStorage-backed watchlist store with subscribe/notify.
 * No external state lib needed.
 */

const STORAGE_KEY = "defiance-hub.watchlist";

type Listener = (items: Set<string>) => void;
const listeners = new Set<Listener>();

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function write(items: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
  listeners.forEach((l) => l(new Set(items)));
}

export const watchlist = {
  get: () => read(),
  has: (id: string) => read().has(id),
  toggle: (id: string) => {
    const items = read();
    const had = items.has(id);
    if (had) items.delete(id);
    else items.add(id);
    write(items);
    return !had;
  },
  add: (id: string) => {
    const items = read();
    items.add(id);
    write(items);
  },
  remove: (id: string) => {
    const items = read();
    items.delete(id);
    write(items);
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
