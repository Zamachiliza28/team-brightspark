import { useEffect, useState } from "react";

export type ActivityEntry = {
  id: string;
  tool: string;
  to: string;
  summary: string;
  at: string;
  demo: boolean;
};

const KEY = "awpa.activity.v1";
const EVENT = "awpa:activity";
const LIMIT = 12;

function read(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(entry: Omit<ActivityEntry, "id" | "at">) {
  if (typeof window === "undefined") return;
  const next = [
    { ...entry, id: crypto.randomUUID(), at: new Date().toISOString() },
    ...read(),
  ].slice(0, LIMIT);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** Hydration-safe: starts empty on the server and fills in after mount. */
export function useActivity(): ActivityEntry[] {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const sync = () => setEntries(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return entries;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}
