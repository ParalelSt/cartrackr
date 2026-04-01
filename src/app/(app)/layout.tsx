import { redirect } from "next/navigation";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import BottomNav from "@/components/navigation/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only enforce auth when Auth0 is configured
  if (isAuth0Configured && auth0) {
    try {
      const session = await auth0.getSession();
      if (!session) {
        redirect("/login");
      }
    } catch {
      // Stale/invalid session cookie — treat as unauthenticated
      redirect("/login");
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--color-background)]">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
