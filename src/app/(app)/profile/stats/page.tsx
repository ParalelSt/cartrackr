"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Fuel, CarFront, Gauge, DollarSign, Droplets, TrendingUp } from "lucide-react";
import { useFuelEntries } from "@/hooks/useFuelEntries";
import { useVehicles } from "@/hooks/useVehicles";
import { useSettings } from "@/hooks/useSettings";
import { getCurrency } from "@/lib/currencies";

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)]">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

export default function UsageStatsPage() {
  const router = useRouter();
  const { entries, allEntries, stats } = useFuelEntries();
  const { vehicles, activeVehicle } = useVehicles();
  const { settings } = useSettings();
  const curr = getCurrency(settings.currency);
  const distUnit = settings.distanceUnit;
  const volUnit = settings.volumeUnit;
  const consumptionLabel = volUnit === "gal" ? "MPG" : `L/100${distUnit}`;

  // All-time stats across all vehicles
  const totalEntriesAllVehicles = allEntries.length;
  const totalSpentAll = allEntries.reduce((s, e) => s + e.totalCost, 0);
  const totalLitersAll = allEntries.reduce((s, e) => s + e.liters, 0);

  // Active vehicle stats
  const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);
  const distanceTravelled =
    sorted.length >= 2 ? sorted[sorted.length - 1].odometer - sorted[0].odometer : 0;

  // First and last entry dates
  const datesSorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const firstEntry = datesSorted[0];
  const lastEntry = datesSorted[datesSorted.length - 1];

  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-2 rounded-xl p-1.5 transition-colors hover:bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
          <h1 className="text-xl font-extrabold text-white">Usage Statistics</h1>
        </div>
      </header>

      <div className="mt-4 space-y-4 px-5 pb-6">
        {/* Overview */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Overview
          </h2>
          <div className="divide-y divide-[var(--color-border)]">
            <StatRow label="Vehicles" value={String(vehicles.length)} icon={<CarFront size={16} />} />
            <StatRow label="Total Fill-ups" value={String(totalEntriesAllVehicles)} icon={<Fuel size={16} />} />
            <StatRow label="Total Spent" value={`${curr.symbol}${totalSpentAll.toFixed(2)}`} icon={<DollarSign size={16} />} />
            <StatRow label={`Total ${volUnit === "gal" ? "Gallons" : "Liters"}`} value={`${totalLitersAll.toFixed(1)} ${volUnit}`} icon={<Droplets size={16} />} />
          </div>
        </div>

        {/* Active vehicle stats */}
        {activeVehicle ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              {activeVehicle.name}
            </h2>
            <div className="divide-y divide-[var(--color-border)]">
              <StatRow label="Fill-ups" value={String(stats.entryCount)} icon={<Fuel size={16} />} />
              <StatRow label="Total Spent" value={`${curr.symbol}${stats.totalSpent.toFixed(2)}`} icon={<DollarSign size={16} />} />
              <StatRow label={`Total ${volUnit === "gal" ? "Gallons" : "Liters"}`} value={`${stats.totalLiters.toFixed(1)} ${volUnit}`} icon={<Droplets size={16} />} />
              <StatRow label="Distance Tracked" value={`${distanceTravelled.toLocaleString()} ${distUnit}`} icon={<Gauge size={16} />} />
              <StatRow label="Avg Consumption" value={`${stats.avgConsumption.toFixed(1)} ${consumptionLabel}`} icon={<TrendingUp size={16} />} />
              <StatRow label={`Cost per ${distUnit}`} value={`${curr.symbol}${stats.costPerKm.toFixed(3)}`} icon={<DollarSign size={16} />} />
              <StatRow label={`Avg Price/${volUnit}`} value={`${curr.symbol}${stats.avgCostPerLiter.toFixed(2)}`} icon={<Droplets size={16} />} />
            </div>
          </div>
        ) : null}

        {/* Timeline */}
        {firstEntry && lastEntry ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Timeline
            </h2>
            <div className="divide-y divide-[var(--color-border)]">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">First entry</span>
                <span className="text-sm font-bold">
                  {new Date(firstEntry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">Last entry</span>
                <span className="text-sm font-bold">
                  {new Date(lastEntry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
