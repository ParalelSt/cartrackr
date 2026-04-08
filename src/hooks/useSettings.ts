"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settingsStorage";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFetched = useRef(false);

  // Fetch from API on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const update = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };

      // Persist to API
      fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch(() => {});

      return updated;
    });
  }, []);

  return { settings, isLoaded, update };
}
