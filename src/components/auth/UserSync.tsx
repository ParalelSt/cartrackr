"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

/** Ensures the authenticated user exists in the database */
export default function UserSync() {
  const { user } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user || hasSynced.current) return;
    hasSynced.current = true;

    fetch("/api/user").catch(() => {});
  }, [user]);

  return null;
}
