"use client";

import { useSyncExternalStore, useCallback } from "react";
import {
  getFuelEntries,
  saveFuelEntry,
  deleteFuelEntry,
  generateId,
  calculateFuelStats,
  type FuelEntry,
} from "@/lib/fuelStorage";

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

export function useFuelEntries() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isLoaded = snapshot >= 0;
  const entries = isLoaded ? getFuelEntries() : [];

  const addEntry = useCallback(
    (data: Omit<FuelEntry, "id" | "pricePerLiter">) => {
      const entry: FuelEntry = {
        ...data,
        id: generateId(),
        pricePerLiter: data.totalCost / data.liters,
      };
      saveFuelEntry(entry);
      notifyListeners();
      return entry;
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    deleteFuelEntry(id);
    notifyListeners();
  }, []);

  const stats = calculateFuelStats(entries);

  return { entries, stats, isLoaded, addEntry, removeEntry };
}
