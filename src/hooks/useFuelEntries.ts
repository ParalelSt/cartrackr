"use client";

import { useSyncExternalStore, useCallback, useMemo, useEffect, useRef } from "react";
import {
  getFuelEntries,
  saveFuelEntry,
  deleteFuelEntry,
  generateId,
  calculateFuelStats,
  type FuelEntry,
} from "@/lib/fuelStorage";
import { getActiveVehicleId } from "@/lib/vehicleStorage";

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
  const allEntries = isLoaded ? getFuelEntries() : [];
  const activeVehicleId = isLoaded ? getActiveVehicleId() : null;
  const hasSynced = useRef(false);

  // Sync from API on mount
  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    fetch("/api/fuel")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        localStorage.setItem("cartrackr_fuel_entries", JSON.stringify(data.entries));
        notifyListeners();
      })
      .catch(() => {
        // Offline — use localStorage
      });
  }, []);

  // Filter entries for the active vehicle
  const entries = useMemo(
    () =>
      activeVehicleId
        ? allEntries.filter((e) => e.vehicleId === activeVehicleId)
        : allEntries,
    [allEntries, activeVehicleId],
  );

  const addEntry = useCallback(
    (data: Omit<FuelEntry, "id" | "pricePerLiter">) => {
      const entry: FuelEntry = {
        ...data,
        id: generateId(),
        pricePerLiter: data.totalCost / data.liters,
      };
      saveFuelEntry(entry);
      notifyListeners();

      // Sync to API
      fetch("/api/fuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => {});

      return entry;
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    deleteFuelEntry(id);
    notifyListeners();

    // Sync to API
    fetch("/api/fuel", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, []);

  const stats = calculateFuelStats(entries);

  return { entries, allEntries, stats, isLoaded, addEntry, removeEntry };
}
