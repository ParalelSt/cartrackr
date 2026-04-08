"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFuelEntries } from "@/hooks/useFuelEntries";
import { useVehicles } from "@/hooks/useVehicles";
import { useSettings } from "@/hooks/useSettings";
import { getCurrency } from "@/lib/currencies";
import { Plus, Trash2, Fuel } from "lucide-react";
import type { FuelEntry } from "@/lib/fuelStorage";

interface MonthStats {
  totalSpent: number;
  totalLiters: number;
  avgPricePerLiter: number;
  avgConsumption: number;
  distanceKm: number;
  fillUps: number;
}

interface MonthGroup {
  label: string;
  entries: FuelEntry[];
  stats: MonthStats;
}

function calcMonthStats(entries: FuelEntry[]): MonthStats {
  const totalSpent = entries.reduce((s, e) => s + e.totalCost, 0);
  const totalLiters = entries.reduce((s, e) => s + e.liters, 0);
  const avgPricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;

  const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);
  const distanceKm =
    sorted.length >= 2
      ? sorted[sorted.length - 1].odometer - sorted[0].odometer
      : 0;
  const avgConsumption =
    distanceKm > 0 ? (totalLiters / distanceKm) * 100 : 0;

  return {
    totalSpent,
    totalLiters,
    avgPricePerLiter,
    avgConsumption,
    distanceKm,
    fillUps: entries.length,
  };
}

/** Group entries by "Month Year" with stats */
function groupByMonth(entries: FuelEntry[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const map = new Map<string, FuelEntry[]>();

  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!map.has(key)) {
      const arr: FuelEntry[] = [];
      map.set(key, arr);
      groups.push({ label, entries: arr, stats: { totalSpent: 0, totalLiters: 0, avgPricePerLiter: 0, avgConsumption: 0, distanceKm: 0, fillUps: 0 } });
    }
    map.get(key)!.push(entry);
  }

  // Calculate stats for each group
  for (const group of groups) {
    group.stats = calcMonthStats(group.entries);
  }

  return groups;
}

export default function FuelPage() {
  const { activeVehicle, activeVehicleId } = useVehicles();
  const { entries, stats, isLoaded, removeEntry } = useFuelEntries(activeVehicleId);
  const { settings } = useSettings();

  const cur = getCurrency(settings.currency);
  const distUnit = settings.distanceUnit;
  const volUnit = settings.volumeUnit;
  const isMetric = distUnit === "km" && volUnit === "L";
  const consumptionLabel = isMetric ? "L/100km" : "MPG";

  // Convert consumption: L/100km stored internally
  const formatConsumption = (lPer100km: number) => {
    if (lPer100km <= 0) return "—";
    if (!isMetric) {
      // Convert L/100km to MPG (US)
      const mpg = 235.215 / lPer100km;
      return mpg.toFixed(1);
    }
    return lPer100km.toFixed(1);
  };

  const formatVol = (liters: number) => {
    if (volUnit === "gal") return (liters * 0.264172).toFixed(1);
    return liters.toFixed(1);
  };

  const monthGroups = useMemo(() => groupByMonth(entries), [entries]);

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-extrabold text-white">Fuel Log</h1>
          {activeVehicle ? (
            <p className="text-xs font-semibold text-white/60">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/10 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Spent
            </p>
            <p className="mt-0.5 text-base font-extrabold text-white">
              {cur.symbol}{stats.totalSpent.toFixed(0)}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              {consumptionLabel}
            </p>
            <p className="mt-0.5 text-base font-extrabold text-white">
              {formatConsumption(stats.avgConsumption)}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              {volUnit === "gal" ? "Gallons" : "Liters"}
            </p>
            <p className="mt-0.5 text-base font-extrabold text-white">
              {formatVol(stats.totalLiters)}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-4 space-y-3 px-5">
        {/* Add button */}
        <Link
          href="/fuel/add"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Fuel Entry
        </Link>

        {/* Entry list grouped by month */}
        {!isLoaded ? (
          <div className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[var(--color-text-muted)] shadow-sm">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-4 py-14 text-center shadow-sm">
            <Fuel size={40} className="text-[var(--color-border)]" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              No fuel entries yet
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Tap the button above to log your first fill-up
            </p>
          </div>
        ) : (
          monthGroups.map((group) => (
            <section key={group.label}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {group.label}
              </h2>

              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {group.entries.map((entry, i) => {
                  const isLast = i === group.entries.length - 1;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 px-4 py-3.5 ${
                        isLast ? "" : "border-b border-[var(--color-border)]"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)]">
                        <Fuel size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-semibold">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm font-extrabold">
                            {cur.symbol}{entry.totalCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-baseline justify-between text-xs text-[var(--color-text-muted)]">
                          <p>
                            {entry.odometer.toLocaleString()} {distUnit} &middot;{" "}
                            {formatVol(entry.liters)} {volUnit}
                          </p>
                          <p>{cur.symbol}{entry.pricePerLiter.toFixed(2)}/{volUnit}</p>
                        </div>
                        {entry.notes ? (
                          <p className="mt-0.5 text-xs italic text-[var(--color-text-muted)]">
                            {entry.notes}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        className="ml-1 shrink-0 rounded-xl p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-[var(--color-danger)]"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
