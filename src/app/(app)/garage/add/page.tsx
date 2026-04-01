"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import NumberStepper from "@/components/ui/NumberStepper";

const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "lpg", label: "LPG" },
] as const;

export default function AddVehiclePage() {
  const router = useRouter();
  const { addVehicle } = useVehicles();

  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [fuelType, setFuelType] = useState<
    "petrol" | "diesel" | "electric" | "hybrid" | "lpg"
  >("petrol");
  const [odometer, setOdometer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    name.trim().length > 0 &&
    make.trim().length > 0 &&
    model.trim().length > 0 &&
    parseInt(year) >= 1900 &&
    parseInt(year) <= 2100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    addVehicle({
      name: name.trim(),
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year),
      fuelType,
      odometer: parseFloat(odometer) || 0,
    });

    router.push("/garage");
  };

  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl p-1 transition-colors hover:bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h1 className="text-xl font-extrabold text-white">Add Vehicle</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 px-5 pb-6">
        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Vehicle Name
            </label>
            <input
              id="name"
              type="text"
              placeholder='e.g. "My Daily" or "Work Truck"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          {/* Make */}
          <div>
            <label
              htmlFor="make"
              className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Make
            </label>
            <input
              id="make"
              type="text"
              placeholder="e.g. Toyota, Honda, Ford"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor="model"
              className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Model
            </label>
            <input
              id="model"
              type="text"
              placeholder="e.g. Corolla, Civic, F-150"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          {/* Year */}
          <NumberStepper
            id="year"
            label="Year"
            value={year}
            onChange={setYear}
            placeholder="e.g. 2021"
            step={1}
            min={1900}
          />

          {/* Fuel type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">
              Fuel Type
            </label>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((ft) => {
                const isSelected = fuelType === ft.value;
                return (
                  <button
                    key={ft.value}
                    type="button"
                    onClick={() => setFuelType(ft.value)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-gray-200"
                    }`}
                  >
                    {ft.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Odometer */}
          <NumberStepper
            id="odometer"
            label="Current Odometer"
            value={odometer}
            onChange={setOdometer}
            placeholder="e.g. 42350"
            step={100}
            unit="km"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
        >
          Save Vehicle
        </button>
      </form>
    </div>
  );
}
