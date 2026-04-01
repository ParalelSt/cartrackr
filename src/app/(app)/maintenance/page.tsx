import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <h1 className="text-xl font-extrabold text-white">Service</h1>
      </header>
      <div className="mt-4 px-5">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-16 shadow-sm text-center">
          <Wrench size={44} className="text-[var(--color-border)]" />
          <p className="text-sm font-bold text-[var(--color-text-muted)]">
            Maintenance tracking coming soon
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Track oil changes, brake pads, filters, and more
          </p>
        </div>
      </div>
    </div>
  );
}
