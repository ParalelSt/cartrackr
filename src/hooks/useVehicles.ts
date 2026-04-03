"use client";

import { useSyncExternalStore, useCallback } from "react";
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
      return vehicle;
    },
    [],
  );

  const removeVehicle = useCallback((id: string) => {
    deleteVehicle(id);
    notifyListeners();
  }, []);

  const switchVehicle = useCallback((id: string) => {
    setActiveVehicleId(id);
    notifyListeners();
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
