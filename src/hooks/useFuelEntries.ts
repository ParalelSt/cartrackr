"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { generateId, calculateFuelStats, type FuelEntry } from "@/lib/fuelStorage";

export function useFuelEntries(activeVehicleId?: string | null) {
  const [allEntries, setAllEntries] = useState<FuelEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFetched = useRef(false);

  // Fetch from API on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/fuel")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setAllEntries(data.entries);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
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

      // Optimistic update
      setAllEntries((prev) => [entry, ...prev]);

      // Persist to API
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
    setAllEntries((prev) => prev.filter((e) => e.id !== id));

    fetch("/api/fuel", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, []);

  const stats = calculateFuelStats(entries);

  return { entries, allEntries, stats, isLoaded, addEntry, removeEntry };
}
