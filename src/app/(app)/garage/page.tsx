"use client";

import Link from "next/link";
import { useVehicles } from "@/hooks/useVehicles";
import {
  Plus,
  CarFront,
  Trash2,
  Check,
} from "lucide-react";

export default function GaragePage() {
  const {
    vehicles,
    activeVehicleId,
    isLoaded,
    removeVehicle,
    switchVehicle,
  } = useVehicles();

  const FUEL_TYPE_LABELS = {
    petrol: "Petrol",
    diesel: "Diesel",
    electric: "Electric",
    hybrid: "Hybrid",
    lpg: "LPG",
  } as const;

  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <h1 className="text-xl font-extrabold text-white">Garage</h1>
        <p className="mt-0.5 text-sm font-medium text-white/70">
          {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="mt-4 space-y-3 px-5">
        <Link
          href="/garage/add"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Vehicle
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {!isLoaded ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
              Loading...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <CarFront size={40} className="text-[var(--color-border)]" />
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                No vehicles yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Add your first vehicle to start tracking
              </p>
            </div>
          ) : (
            vehicles.map((vehicle, i) => {
              const isLast = i === vehicles.length - 1;
              const isActive = vehicle.id === activeVehicleId;
              return (
                <div
                  key={vehicle.id}
                  className={`flex items-center gap-3 px-4 py-4 ${
                    isLast ? "" : "border-b border-[var(--color-border)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => switchVehicle(vehicle.id)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-gray-100 text-[var(--color-text-muted)]"
                    }`}
                    aria-label={`Select ${vehicle.name}`}
                  >
                    {isActive ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <CarFront size={18} />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{vehicle.name}</p>
                      {isActive ? (
                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                          ACTIVE
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {vehicle.year} {vehicle.make} {vehicle.model} &middot;{" "}
                      {FUEL_TYPE_LABELS[vehicle.fuelType]}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {vehicle.odometer.toLocaleString()} km
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVehicle(vehicle.id)}
                    className="shrink-0 rounded-xl p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-[var(--color-danger)]"
                    aria-label={`Delete ${vehicle.name}`}
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
