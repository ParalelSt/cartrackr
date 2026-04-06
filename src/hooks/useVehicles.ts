"use client";

import { useSyncExternalStore, useCallback, useEffect, useRef } from "react";
import {
  getVehicles,
  saveVehicle,
  deleteVehicle,
  getActiveVehicle,
  getActiveVehicleId,
  setActiveVehicleId,
  generateVehicleId,
  type Vehicle,
} from "@/lib/vehicleStorage";

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

export function useVehicles() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isLoaded = snapshot >= 0;
  const vehicles = isLoaded ? getVehicles() : [];
  const activeVehicle = isLoaded ? getActiveVehicle() : null;
  const activeVehicleId = isLoaded ? getActiveVehicleId() : null;
  const hasSynced = useRef(false);

  // Sync from API on mount
  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    fetch("/api/vehicles")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        // Replace localStorage with API data
        localStorage.setItem("cartrackr_vehicles", JSON.stringify(data.vehicles));
        if (data.activeVehicleId) {
          localStorage.setItem("cartrackr_active_vehicle", data.activeVehicleId);
        }
        notifyListeners();
      })
      .catch(() => {
        // Offline — use localStorage
      });
  }, []);

  const addVehicle = useCallback(
    (data: Omit<Vehicle, "id" | "createdAt">, setActive = false) => {
      const vehicle: Vehicle = {
        ...data,
        id: generateVehicleId(),
        createdAt: new Date().toISOString(),
      };
      saveVehicle(vehicle);
      // Only auto-set active if it's the first vehicle or explicitly requested
      if (setActive || getVehicles().length === 1) {
        setActiveVehicleId(vehicle.id);
      }
      notifyListeners();

      // Sync to API
      fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
      }).catch(() => {});

      return vehicle;
    },
    [],
  );

  const removeVehicle = useCallback((id: string) => {
    deleteVehicle(id);
    notifyListeners();

    // Sync to API
    fetch("/api/vehicles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }, []);

  const switchVehicle = useCallback((id: string) => {
    setActiveVehicleId(id);
    notifyListeners();

    // Sync to API
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
