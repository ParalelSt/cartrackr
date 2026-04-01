import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "lpg"]),
  odometer: z.number().nonnegative(),
  createdAt: z.string(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

const VEHICLES_KEY = "cartrackr_vehicles";
const ACTIVE_VEHICLE_KEY = "cartrackr_active_vehicle";

/** Read all vehicles from localStorage */
export function getVehicles(): Vehicle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VEHICLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => vehicleSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
}

/** Save a new vehicle */
export function saveVehicle(vehicle: Vehicle): void {
  const vehicles = getVehicles();
  vehicles.push(vehicle);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
}

/** Delete a vehicle by id */
export function deleteVehicle(id: string): void {
  const vehicles = getVehicles().filter((v) => v.id !== id);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  if (getActiveVehicleId() === id) {
    const next = vehicles[0];
    if (next) {
      setActiveVehicleId(next.id);
    } else {
      localStorage.removeItem(ACTIVE_VEHICLE_KEY);
    }
  }
}

/** Get the active vehicle id */
export function getActiveVehicleId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_VEHICLE_KEY);
}

/** Set the active vehicle */
export function setActiveVehicleId(id: string): void {
  localStorage.setItem(ACTIVE_VEHICLE_KEY, id);
}

/** Get the active vehicle */
export function getActiveVehicle(): Vehicle | null {
  const id = getActiveVehicleId();
  if (!id) return null;
  return getVehicles().find((v) => v.id === id) ?? null;
}

/** Generate a unique id */
export function generateVehicleId(): string {
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
