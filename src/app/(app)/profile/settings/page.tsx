"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { CURRENCIES, getCurrency } from "@/lib/currencies";
import type { Settings } from "@/lib/settingsStorage";

const DISTANCE_UNITS: { value: Settings["distanceUnit"]; label: string }[] = [
  { value: "km", label: "Kilometers (km)" },
  { value: "mi", label: "Miles (mi)" },
];

const VOLUME_UNITS: { value: Settings["volumeUnit"]; label: string }[] = [
  { value: "L", label: "Liters (L)" },
  { value: "gal", label: "Gallons (gal)" },
];

function ToggleChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
              value === opt.value
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const { settings, update } = useSettings();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  const currentCurrency = getCurrency(settings.currency);

  const filteredCurrencies = currencySearch.trim()
    ? CURRENCIES.filter(
        (c) =>
          c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
          c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
          c.symbol.toLowerCase().includes(currencySearch.toLowerCase()),
      )
    : CURRENCIES;

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
          <h1 className="text-xl font-extrabold text-white">
            Account Settings
          </h1>
        </div>
      </header>

      <div className="mt-4 space-y-4 px-5 pb-6">
        {/* Units */}
        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Units & Currency
          </h2>

          {/* Currency selector */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">
              Currency
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCurrencyPicker(true);
                setCurrencySearch("");
              }}
              className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm transition-colors hover:bg-gray-50"
            >
              <span className="font-medium">
                {currentCurrency.symbol} {currentCurrency.code}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {currentCurrency.name}
              </span>
            </button>
          </div>

          <ToggleChips
            label="Distance"
            options={DISTANCE_UNITS}
            value={settings.distanceUnit}
            onChange={(v) => update({ distanceUnit: v })}
          />

          <ToggleChips
            label="Volume"
            options={VOLUME_UNITS}
            value={settings.volumeUnit}
            onChange={(v) => update({ volumeUnit: v })}
          />
        </div>

        {/* Data */}
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Data
          </h2>
          <button
            type="button"
            onClick={() => {
              const data = {
                vehicles: localStorage.getItem("cartrackr_vehicles"),
                fuelEntries: localStorage.getItem("cartrackr_fuel_entries"),
                settings: localStorage.getItem("cartrackr_settings"),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `cartrackr-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full rounded-xl border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-gray-50 active:scale-[0.98]"
          >
            Export Data
          </button>
          <button
            type="button"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".json";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const data = JSON.parse(reader.result as string);
                    if (data.vehicles)
                      localStorage.setItem("cartrackr_vehicles", data.vehicles);
                    if (data.fuelEntries)
                      localStorage.setItem(
                        "cartrackr_fuel_entries",
                        data.fuelEntries,
                      );
                    if (data.settings)
                      localStorage.setItem("cartrackr_settings", data.settings);
                    window.location.reload();
                  } catch {
                    alert("Invalid backup file.");
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            }}
            className="w-full rounded-xl border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-gray-50 active:scale-[0.98]"
          >
            Import Data
          </button>
        </div>
      </div>

      {/* Currency picker modal */}
      {showCurrencyPicker ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-background)]">
          <header className="bg-[var(--color-primary)] px-5 pb-4 pt-14">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCurrencyPicker(false)}
                className="-ml-2 rounded-xl p-1.5 transition-colors hover:bg-white/15"
                aria-label="Close"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <h2 className="text-lg font-extrabold text-white">
                Select Currency
              </h2>
            </div>
            <div className="relative mt-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search currencies..."
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                autoFocus
                className="w-full rounded-xl bg-white/15 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/40 outline-none"
              />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-3">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {filteredCurrencies.map((c, i) => {
                const isSelected = c.code === settings.currency;
                const isLast = i === filteredCurrencies.length - 1;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      update({ currency: c.code });
                      setShowCurrencyPicker(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 ${
                      isLast ? "" : "border-b border-[var(--color-border)]"
                    } ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <span className="w-10 text-center text-sm font-bold text-[var(--color-primary)]">
                      {c.symbol}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.code}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {c.name}
                      </p>
                    </div>
                    {isSelected ? (
                      <span className="rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                        ACTIVE
                      </span>
                    ) : null}
                  </button>
                );
              })}
              {filteredCurrencies.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
                  No currencies found
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
