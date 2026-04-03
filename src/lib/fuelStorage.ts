import { z } from "zod";

/** Schema for a single fuel log entry */
export const fuelEntrySchema = z.object({
  id: z.string(),
  vehicleId: z.string().optional(),
  date: z.string(),
  odometer: z.number().positive(),
  liters: z.number().positive(),
  totalCost: z.number().positive(),
  pricePerLiter: z.number().positive(),
  notes: z.string().optional(),
});

export type FuelEntry = z.infer<typeof fuelEntrySchema>;

const STORAGE_KEY = "cartrackr_fuel_entries";
const MIGRATED_KEY = "cartrackr_fuel_migrated_v1";

/** Assign legacy entries (no vehicleId) to the given vehicle */
export function migrateOrphanedEntries(vehicleId: string): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATED_KEY)) return;

  const entries = getFuelEntries();
  let changed = false;
  for (const entry of entries) {
    if (!entry.vehicleId) {
      entry.vehicleId = vehicleId;
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
  localStorage.setItem(MIGRATED_KEY, "1");
}

/** Read all fuel entries from localStorage */
export function getFuelEntries(): FuelEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => fuelEntrySchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
}

/** Save a new fuel entry */
export function saveFuelEntry(entry: FuelEntry): void {
  const entries = getFuelEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Delete a fuel entry by id */
export function deleteFuelEntry(id: string): void {
  const entries = getFuelEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Generate a unique id */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Calculate stats from fuel entries */
export function calculateFuelStats(entries: FuelEntry[]) {
  if (entries.length === 0) {
    return {
      totalSpent: 0,
      totalLiters: 0,
      avgCostPerLiter: 0,
      avgConsumption: 0,
      costPerKm: 0,
      entryCount: 0,
    };
  }

  const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);
  const totalSpent = entries.reduce((sum, e) => sum + e.totalCost, 0);
  const totalLiters = entries.reduce((sum, e) => sum + e.liters, 0);
  const avgCostPerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;

  const hasMultipleEntries = sorted.length >= 2;
  const distanceTravelled = hasMultipleEntries
    ? sorted[sorted.length - 1].odometer - sorted[0].odometer
    : 0;

  const avgConsumption =
    distanceTravelled > 0 ? (totalLiters / distanceTravelled) * 100 : 0;
  const costPerKm = distanceTravelled > 0 ? totalSpent / distanceTravelled : 0;

  return {
    totalSpent,
    totalLiters,
    avgCostPerLiter,
    avgConsumption,
    costPerKm,
    entryCount: entries.length,
  };
}
