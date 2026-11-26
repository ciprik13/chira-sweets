"use client";

import { useSyncExternalStore } from "react";
import { sanitizeStored, updateList, type ListItem } from "./message";

/*
 * Order list kept in this browser only (per-viewer convenience). Storage can be
 * unavailable (private mode, blocked site data): the list then lives in memory.
 */
const KEY = "chira-order-list-v1";
const EMPTY: ListItem[] = [];
let items: ListItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    items = sanitizeStored(
      JSON.parse(window.localStorage.getItem(KEY) ?? "[]"),
    );
  } catch {
    items = EMPTY;
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable: keep in memory */
  }
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function dispatch(action: Parameters<typeof updateList>[1]) {
  load();
  items = updateList(items, action);
  save();
  listeners.forEach((l) => l());
}

export function useOrderList(): ListItem[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return items;
    },
    () => EMPTY,
  );
}
