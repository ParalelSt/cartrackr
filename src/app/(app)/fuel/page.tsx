"use client";

import Link from "next/link";
import { useFuelEntries } from "@/hooks/useFuelEntries";
import { useVehicles } from "@/hooks/useVehicles";
import { Plus, Trash2, Fuel } from "lucide-react";

export default function FuelPage() {
  const { entries, stats, isLoaded, removeEntry } = useFuelEntries();
  const { activeVehicle } = useVehicles();

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <h1 className="text-xl font-extrabold text-white">Fuel Log</h1>
        {activeVehicle ? (
          <p className="mt-0.5 text-sm font-medium text-white/70">
            {activeVehicle.name}
          </p>
        ) : null}
        <div className="mt-3 flex gap-6 text-sm">
          <div>
            <p className="text-[11px] font-medium text-white/60">
              Total Spent
            </p>
            <p className="text-lg font-extrabold text-white">
              ${stats.totalSpent.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-white/60">
              Avg Price/L
            </p>
            <p className="text-lg font-extrabold text-white">
              ${stats.avgCostPerLiter.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-white/60">
              Total Liters
            </p>
            <p className="text-lg font-extrabold text-white">
              {stats.totalLiters.toFixed(1)} L
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

        {/* Entry list */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {!isLoaded ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
              Loading...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <Fuel size={40} className="text-[var(--color-border)]" />
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                No fuel entries yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Tap the button above to log your first fill-up
              </p>
            </div>
          ) : (
            entries.map((entry, i) => {
              const isLast = i === entries.length - 1;
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
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-extrabold">
                        ${entry.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-[var(--color-text-muted)]">
                      <p>
                        {entry.odometer.toLocaleString()} km &middot;{" "}
                        {entry.liters.toFixed(1)} L
                      </p>
                      <p>${entry.pricePerLiter.toFixed(2)}/L</p>
                    </div>
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
