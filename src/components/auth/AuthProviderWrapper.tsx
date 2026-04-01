"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import type { User } from "@auth0/nextjs-auth0/types";

interface Props {
  user: User | undefined;
  children: React.ReactNode;
}

export default function AuthProviderWrapper({ user, children }: Props) {
  return <Auth0Provider user={user}>{children}</Auth0Provider>;
}
