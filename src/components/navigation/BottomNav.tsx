"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Fuel,
  Wrench,
  CarFront,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fuel", label: "Fuel", icon: Fuel },
  { href: "/maintenance", label: "Service", icon: Wrench },
  { href: "/garage", label: "Garage", icon: CarFront },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const items = NAV_ITEMS.map((item) => {
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
          isActive
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-sm pb-safe">
      <div className="mx-auto flex max-w-lg">{items}</div>
    </nav>
  );
}
