"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { type Vehicle } from "@/lib/vehicleStorage";
import { generateVehicleId } from "@/lib/vehicleStorage";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFetched = useRef(false);

  // Fetch from API on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/vehicles")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setVehicles(data.vehicles);
          if (data.activeVehicleId) setActiveVehicleId(data.activeVehicleId);
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) ?? null;

  const addVehicle = useCallback(
    (data: Omit<Vehicle, "id" | "createdAt">, setActive = false) => {
      const vehicle: Vehicle = {
        ...data,
        id: generateVehicleId(),
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      const shouldSetActive = setActive || vehicles.length === 0;
      setVehicles((prev) => [vehicle, ...prev]);
      if (shouldSetActive) setActiveVehicleId(vehicle.id);

      // Persist to API
      fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
      }).catch(() => {});

      return vehicle;
    },
    [vehicles.length],
  );

  const removeVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    fetch("/api/vehicles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, []);

  const switchVehicle = useCallback((id: string) => {
    setActiveVehicleId(id);

    fetch("/api/vehicles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeVehicleId: id }),
    }).catch(() => {});
  }, []);

  return {
    vehicles,
    activeVehicle,
    activeVehicleId,
    isLoaded,
    addVehicle,
    removeVehicle,
    switchVehicle,
  };
}
