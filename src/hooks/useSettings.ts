"use client";

import { useSyncExternalStore, useCallback } from "react";
import {
  getSettings,
  updateSettings,
  type Settings,
} from "@/lib/settingsStorage";

let version = 0;
const listeners = new Set<() => void>();

function notifyListeners() {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): number {
  return version;
}

function getServerSnapshot(): number {
  return -1;
}

export function useSettings() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isLoaded = snapshot >= 0;
  const settings = isLoaded ? getSettings() : getSettings();

  const update = useCallback((partial: Partial<Settings>) => {
    updateSettings(partial);
    notifyListeners();
  }, []);

  return { settings, isLoaded, update };
}
