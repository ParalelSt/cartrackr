/** Check if notifications are supported */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
}

/** Request notification permission */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/** Get current permission state */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/** Schedule a local notification via service worker */
export async function showNotification(
  title: string,
  options?: NotificationOptions,
): Promise<void> {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    ...options,
  });
}

/** Check if a fuel reminder should fire based on last entry date */
export function shouldRemindFuel(
  lastEntryDate: string | null,
  reminderDays: number,
): boolean {
  if (!lastEntryDate) return false;
  const last = new Date(lastEntryDate).getTime();
  const now = Date.now();
  const daysSince = (now - last) / (1000 * 60 * 60 * 24);
  return daysSince >= reminderDays;
}

const LAST_REMINDER_KEY = "cartrackr_last_fuel_reminder";
const WEEKEND_REMINDER_KEY = "cartrackr_last_weekend_reminder";

/** Check and fire fuel reminder if needed — max once per week */
export function checkAndFireFuelReminder(
  lastEntryDate: string | null,
  reminderDays: number,
): void {
  if (!shouldRemindFuel(lastEntryDate, reminderDays)) return;

  // Only remind once per 7 days
  const lastReminder = localStorage.getItem(LAST_REMINDER_KEY);
  if (lastReminder) {
    const daysSinceReminder =
      (Date.now() - new Date(lastReminder).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceReminder < 7) return;
  }

  localStorage.setItem(LAST_REMINDER_KEY, new Date().toISOString());
  showNotification("Time to log fuel!", {
    body: `It's been over ${reminderDays} days since your last fuel entry.`,
    tag: "fuel-reminder",
  });
}

/** Weekend nudge — fires on Saturday/Sunday, max once per weekend */
export function checkWeekendReminder(hasEntries: boolean): void {
  if (!hasEntries) return;

  const now = new Date();
  const day = now.getDay();
  // 0 = Sunday, 6 = Saturday
  if (day !== 0 && day !== 6) return;

  const lastWeekend = localStorage.getItem(WEEKEND_REMINDER_KEY);
  if (lastWeekend) {
    const daysSince =
      (Date.now() - new Date(lastWeekend).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 6) return;
  }

  localStorage.setItem(WEEKEND_REMINDER_KEY, new Date().toISOString());
  showNotification("Weekend check-in", {
    body: "Filled up recently? Log it while it's fresh.",
    tag: "weekend-reminder",
  });
}
