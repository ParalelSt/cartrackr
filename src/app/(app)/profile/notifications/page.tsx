"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, BellOff, BellRing } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import {
  requestNotificationPermission,
  getNotificationPermission,
  showNotification,
} from "@/lib/notifications";

function Toggle({
  enabled,
  onToggle,
  disabled,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        enabled ? "bg-[var(--color-primary)]" : "bg-gray-300"
      } ${disabled ? "opacity-40" : ""}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function DaysInput({
  label,
  value,
  max,
  fallback,
  onCommit,
}: {
  label: string;
  value: number;
  max: number;
  fallback: number;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  // Keep draft in sync if value changes externally
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const handleBlur = () => {
    const parsed = parseInt(draft, 10);
    const clamped = Number.isNaN(parsed) || parsed < 1 ? fallback : Math.min(parsed, max);
    setDraft(String(clamped));
    if (clamped !== value) onCommit(clamped);
  };

  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
        className="w-16 rounded-xl border border-[var(--color-border)] px-3 py-2 text-center text-sm font-semibold outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
        days
      </span>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { settings, update } = useSettings();
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const supported = permission !== "unsupported";
  const granted = permission === "granted";
  const denied = permission === "denied";

  const handleEnableNotifications = async () => {
    if (!supported) return;

    if (!granted) {
      const result = await requestNotificationPermission();
      setPermission(getNotificationPermission());
      if (!result) return;
    }

    update({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleTestNotification = () => {
    showNotification("CarTrackr Test", {
      body: "Notifications are working!",
      tag: "test",
    });
  };

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
          <h1 className="text-xl font-extrabold text-white">Notifications</h1>
        </div>
      </header>

      <div className="mt-4 space-y-4 px-5 pb-6">
        {/* Permission status */}
        {!supported ? (
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4">
            <BellOff size={20} className="shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              Notifications are not supported in this browser.
            </p>
          </div>
        ) : denied ? (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4">
            <BellOff size={20} className="shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Notifications blocked
              </p>
              <p className="text-xs text-red-600">
                Enable notifications in your browser settings for this site.
              </p>
            </div>
          </div>
        ) : null}

        {/* Master toggle */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellRing
                size={20}
                className="text-[var(--color-primary)]"
              />
              <div>
                <p className="text-sm font-bold">Enable Notifications</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Get reminders for fuel and maintenance
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.notificationsEnabled && granted}
              onToggle={handleEnableNotifications}
              disabled={!supported || denied}
            />
          </div>
        </div>

        {/* Reminder settings */}
        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Reminders
          </h2>

          {/* Fuel reminder */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Fuel Reminder</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Remind when no fuel logged
                </p>
              </div>
              <Toggle
                enabled={settings.fuelReminder}
                onToggle={() =>
                  update({ fuelReminder: !settings.fuelReminder })
                }
                disabled={!settings.notificationsEnabled || !granted}
              />
            </div>
            {settings.fuelReminder && settings.notificationsEnabled && granted ? (
              <DaysInput
                label="Remind after"
                value={settings.fuelReminderDays}
                max={90}
                fallback={14}
                onCommit={(v) => update({ fuelReminderDays: v })}
              />
            ) : null}
          </div>

          {/* Maintenance reminder — disabled until built */}
          <div className="border-t border-[var(--color-border)] pt-4 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Maintenance Reminder</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Coming soon
                </p>
              </div>
              <Toggle enabled={false} onToggle={() => {}} disabled />
            </div>
          </div>
        </div>

        {/* Test notification */}
        {settings.notificationsEnabled && granted ? (
          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full rounded-2xl border border-[var(--color-primary)] py-3.5 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-blue-50 active:scale-[0.98]"
          >
            Send Test Notification
          </button>
        ) : null}
      </div>
    </div>
  );
}
