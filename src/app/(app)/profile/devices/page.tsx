"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Smartphone, Monitor, Tablet } from "lucide-react";

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

const DEVICE_ICONS = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

export default function ConnectedDevicesPage() {
  const router = useRouter();
  const deviceType = getDeviceType();
  const DeviceIcon = DEVICE_ICONS[deviceType];
  const isPWA =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Record<string, unknown>).standalone === true));

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
          <h1 className="text-xl font-extrabold text-white">Connected Devices</h1>
        </div>
      </header>

      <div className="mt-4 space-y-4 px-5 pb-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            This Device
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)]">
              <DeviceIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold capitalize">{deviceType}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isPWA ? "Installed (PWA)" : "Browser"}
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">
              Active
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your data is synced across all devices via the cloud. Sign in with the same account to access your vehicles and fuel logs anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
