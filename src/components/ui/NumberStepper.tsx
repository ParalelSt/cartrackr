"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  step?: number;
  min?: number;
  unit?: string;
  unitPosition?: "left" | "right";
}

export default function NumberStepper({
  id,
  label,
  value,
  onChange,
  placeholder,
  step = 1,
  min = 0,
  unit,
  unitPosition = "right",
}: Props) {
  /** Parse a string that may use comma or dot as decimal separator */
  const parse = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const numValue = parse(value);

  const handleIncrement = () => {
    const next = Math.round((numValue + step) * 1000) / 1000;
    onChange(String(next));
  };

  const handleDecrement = () => {
    const next = Math.round((numValue - step) * 1000) / 1000;
    if (next >= min) {
      onChange(String(next));
    }
  };

  const handleChange = (raw: string) => {
    // Allow digits, dots, commas, and empty string while typing
    const cleaned = raw.replace(/[^0-9.,]/g, "");
    onChange(cleaned);
  };

  const hasLeftUnit = unit && unitPosition === "left";
  const hasRightUnit = unit && unitPosition === "right";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] transition-colors hover:bg-gray-200 active:scale-95"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
        <div className="relative flex-1">
          {hasLeftUnit ? (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-text-muted)]">
              {unit}
            </span>
          ) : null}
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-[var(--color-border)] py-2.5 text-center text-sm font-semibold outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
              hasLeftUnit ? "pl-7 pr-3" : hasRightUnit ? "pl-3 pr-10" : "px-3"
            }`}
          />
          {hasRightUnit ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--color-text-muted)]">
              {unit}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-light)] active:scale-95"
          aria-label={`Increase ${label}`}
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
