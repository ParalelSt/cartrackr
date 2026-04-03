"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Heart,
  ChevronRight,
  Settings,
  Bell,
  Smartphone,
  BarChart3,
  Download,
  LogOut,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-[var(--color-primary)] px-5 pb-5 pt-14">
        <h1 className="text-xl font-extrabold text-white">Profile</h1>
      </header>

      <div className="mt-4 space-y-4 px-5 pb-6">
        {/* User card */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--color-primary)]">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <User size={22} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">
              {user?.email ?? ""}
            </p>
          </div>
        </div>

        {/* Donate card */}
        <a
          href="https://ko-fi.com/aronm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 p-4 shadow-sm transition-colors hover:from-rose-100 hover:to-orange-100"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <Heart size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-rose-700">
              Support CarTrackr
            </p>
            <p className="text-xs text-rose-600/70">
              Buy me a coffee on Ko-fi!
            </p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-rose-400" />
        </a>

        {/* Account section */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="px-4 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Account
          </h2>
          {[
            { label: "Account Settings", icon: Settings, href: "/profile/settings" },
            { label: "Notifications", icon: Bell, href: "/profile/notifications" },
            { label: "Usage Statistics", icon: BarChart3, href: "/profile/stats" },
            { label: "Connected Devices", icon: Smartphone, href: "/profile/devices" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3.5 transition-colors hover:bg-gray-50"
            >
              <item.icon
                size={18}
                className="shrink-0 text-[var(--color-primary)]"
              />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight
                size={16}
                className="text-[var(--color-text-muted)]"
              />
            </Link>
          ))}
        </div>

        {/* Install PWA prompt */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="px-4 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            App
          </h2>
          <button
            type="button"
            onClick={() => {
              alert(
                "To install CarTrackr:\n\n" +
                "Android: Tap the menu (three dots) → 'Add to Home screen'\n\n" +
                "iOS: Tap the Share button → 'Add to Home Screen'\n\n" +
                "Desktop: Click the install icon in your browser's address bar"
              );
            }}
            className="flex w-full items-center gap-3 border-t border-[var(--color-border)] px-4 py-3.5 transition-colors hover:bg-gray-50"
          >
            <Download
              size={18}
              className="shrink-0 text-[var(--color-primary)]"
            />
            <span className="flex-1 text-left text-sm font-medium">Install App</span>
            <ChevronRight
              size={16}
              className="text-[var(--color-text-muted)]"
            />
          </button>
        </div>

        {/* Support section */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="px-4 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Support
          </h2>
          <a
            href="/auth/logout"
            className="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3.5 transition-colors hover:bg-red-50"
          >
            <LogOut
              size={18}
              className="shrink-0 text-[var(--color-danger)]"
            />
            <span className="flex-1 text-sm font-medium text-[var(--color-danger)]">
              Log Out
            </span>
          </a>
        </div>

        {/* App info */}
        <div className="pb-2 pt-2 text-center text-xs text-[var(--color-text-muted)]">
          CarTrackr v0.1.0
        </div>
      </div>
    </div>
  );
}
