"use client";

import { useSyncExternalStore, useCallback, useEffect, useRef } from "react";
import {
  getSettings,
  updateSettings,
  saveSettings,
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
  const hasSynced = useRef(false);

  // Sync from API on mount
  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    fetch("/api/settings")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (!data?.settings) return;
        saveSettings(data.settings);
        notifyListeners();
      })
      .catch(() => {
        // Offline — use localStorage
      });
  }, []);

  const update = useCallback((partial: Partial<Settings>) => {
    const updated = updateSettings(partial);
    notifyListeners();

    // Sync to API
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
  }, []);

  return { settings, isLoaded, update };
}
