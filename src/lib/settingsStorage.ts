import { z } from "zod";

export const settingsSchema = z.object({
  // Notifications
  notificationsEnabled: z.boolean(),
  fuelReminder: z.boolean(),
  fuelReminderDays: z.number().int().min(1).max(90),
  maintenanceReminder: z.boolean(),
  maintenanceReminderDays: z.number().int().min(1).max(365),

  // Display
  currency: z.string().min(3).max(3),
  distanceUnit: z.enum(["km", "mi"]),
  volumeUnit: z.enum(["L", "gal"]),
});

export type Settings = z.infer<typeof settingsSchema>;

const SETTINGS_KEY = "cartrackr_settings";

export const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: false,
  fuelReminder: true,
  fuelReminderDays: 14,
  maintenanceReminder: true,
  maintenanceReminderDays: 90,
  currency: "USD",
  distanceUnit: "km",
  volumeUnit: "L",
};

export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = settingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const current = getSettings();
  const updated = { ...current, ...partial };
  saveSettings(updated);
  return updated;
}
