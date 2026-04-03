"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useFuelEntries } from "@/hooks/useFuelEntries";
import { useVehicles } from "@/hooks/useVehicles";
import { useSettings } from "@/hooks/useSettings";
import { checkAndFireFuelReminder, checkWeekendReminder } from "@/lib/notifications";
import { migrateOrphanedEntries } from "@/lib/fuelStorage";
import { getCurrency } from "@/lib/currencies";
import {
  Plus,
  ChevronRight,
  Heart,
  Fuel,
  Droplets,
  DollarSign,
  Gauge,
  CarFront,
} from "lucide-react";

function StatCard({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-extrabold leading-tight tracking-tight">
        {value}
        {unit ? (
          <span className="ml-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { entries, stats, isLoaded } = useFuelEntries();
  const { activeVehicle, vehicles, isLoaded: vehiclesLoaded } = useVehicles();

  const { settings } = useSettings();
  const cur = getCurrency(settings.currency);
  const distUnit = settings.distanceUnit;
  const volUnit = settings.volumeUnit;
  const isMetric = distUnit === "km" && volUnit === "L";
  const consumptionLabel = isMetric ? "L/100km" : "MPG";

  const formatConsumption = (lPer100km: number) => {
    if (lPer100km <= 0) return "—";
    if (!isMetric) return (235.215 / lPer100km).toFixed(1);
    return lPer100km.toFixed(1);
  };

  const recentEntries = entries.slice(0, 3);
  const isReady = isLoaded && vehiclesLoaded;

  const needsVehicle = isReady && vehicles.length === 0;

  // Migrate old fuel entries (no vehicleId) to the first vehicle
  useEffect(() => {
    if (!isReady || vehicles.length === 0) return;
    migrateOrphanedEntries(vehicles[0].id);
  }, [isReady, vehicles]);

  // Check fuel reminder on load
  useEffect(() => {
    if (!isReady || !settings.notificationsEnabled || !settings.fuelReminder) return;
    const lastEntry = entries[0];
    checkAndFireFuelReminder(
      lastEntry?.date ?? null,
      settings.fuelReminderDays,
    );
    checkWeekendReminder(entries.length > 0);
  }, [isReady, settings, entries]);

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-white">Dashboard</h1>
          <a
            href="https://ko-fi.com/aronm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <Heart size={13} />
            Support
          </a>
        </div>
        {activeVehicle ? (
          <p className="mt-1 text-sm font-medium text-white/60">
            {activeVehicle.name}
          </p>
        ) : null}
      </header>

      <div className="mt-4 space-y-4 px-5">
        {/* No vehicle prompt */}
        {needsVehicle ? (
          <Link
            href="/garage/add"
            className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-primary)]/30 bg-blue-50 p-4 transition-colors hover:border-[var(--color-primary)]/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
              <CarFront size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--color-primary)]">
                Add your vehicle
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Add a car to start logging fuel
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-[var(--color-primary)]/50"
            />
          </Link>
        ) : null}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={`Cost per ${distUnit}`}
            value={!isReady ? "—" : `${cur.symbol}${stats.costPerKm.toFixed(2)}`}
            unit={`/${distUnit}`}
            icon={<DollarSign size={16} />}
          />
          <StatCard
            label="Total Spent"
            value={!isReady ? "—" : `${cur.symbol}${stats.totalSpent.toFixed(0)}`}
            icon={<Fuel size={16} />}
          />
          <StatCard
            label="Avg. Consumption"
            value={!isReady ? "—" : formatConsumption(stats.avgConsumption)}
            unit={consumptionLabel}
            icon={<Droplets size={16} />}
          />
          <StatCard
            label="Fill-ups"
            value={!isReady ? "—" : `${stats.entryCount}`}
            icon={<Gauge size={16} />}
          />
        </div>

        {/* Quick add */}
        {!needsVehicle ? (
          <Link
            href="/fuel/add"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Fuel Entry
          </Link>
        ) : null}

        {/* Recent fuel logs */}
        <section className="pb-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Recent Fuel Logs
            </h2>
            <Link
              href="/fuel"
              className="flex items-center gap-0.5 text-xs font-semibold text-[var(--color-primary)]"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {recentEntries.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Fuel
                  size={36}
                  className="mx-auto mb-2 text-[var(--color-border)]"
                />
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  No fuel entries yet
                </p>
              </div>
            ) : (
              recentEntries.map((entry, i) => {
                const isLast = i === recentEntries.length - 1;
                return (
                  <Link
                    key={entry.id}
                    href="/fuel"
                    className={`flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50 ${
                      isLast ? "" : "border-b border-[var(--color-border)]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {entry.odometer.toLocaleString()} {distUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {cur.symbol}{entry.totalCost.toFixed(2)}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {entry.liters.toFixed(1)} {volUnit}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
