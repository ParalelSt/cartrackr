"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useFuelEntries } from "@/hooks/useFuelEntries";
import { useVehicles } from "@/hooks/useVehicles";
import NumberStepper from "@/components/ui/NumberStepper";

export default function AddFuelEntryPage() {
  const router = useRouter();
  const { addEntry } = useFuelEntries();
  const { activeVehicle, vehicles } = useVehicles();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState("");
  const [liters, setLiters] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedLiters = parseFloat(liters);
  const parsedCost = parseFloat(totalCost);
  const pricePerLiter =
    parsedLiters > 0 && parsedCost > 0 ? parsedCost / parsedLiters : 0;

  const isValid =
    date.length > 0 &&
    parseFloat(odometer) > 0 &&
    parsedLiters > 0 &&
    parsedCost > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    addEntry({
      date,
      odometer: parseFloat(odometer),
      liters: parsedLiters,
      totalCost: parsedCost,
      notes: notes.trim() || undefined,
    });

    router.push("/fuel");
  };

  const noVehicle = vehicles.length === 0;
  if (noVehicle) {
    router.push("/garage/add");
    return null;
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
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
          <div>
            <h1 className="text-xl font-extrabold text-white">Fuel Entry</h1>
            {activeVehicle ? (
              <p className="text-sm font-medium text-white/70">
                {activeVehicle.name}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 px-5 pb-6">
        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          {/* Odometer */}
          <NumberStepper
            id="odometer"
            label="Odometer"
            value={odometer}
            onChange={setOdometer}
            placeholder="e.g. 42350"
            step={1}
            unit="km"
          />

          {/* Liters */}
          <NumberStepper
            id="liters"
            label="Liters"
            value={liters}
            onChange={setLiters}
            placeholder="e.g. 45.6"
            step={0.5}
            unit="L"
          />

          {/* Total Cost */}
          <NumberStepper
            id="totalCost"
            label="Total Cost"
            value={totalCost}
            onChange={setTotalCost}
            placeholder="e.g. 72.50"
            step={1}
            unit="$"
            unitPosition="left"
          />

          {/* Calculated price per liter */}
          {pricePerLiter > 0 ? (
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Price per liter:{" "}
              </span>
              <span className="text-sm font-extrabold text-[var(--color-primary)]">
                ${pricePerLiter.toFixed(3)}/L
              </span>
            </div>
          ) : null}

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Notes (optional)
            </label>
            <input
              id="notes"
              type="text"
              placeholder="e.g. Shell station on Main St"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
        >
          Save Fuel Entry
        </button>
      </form>
    </div>
  );
}
