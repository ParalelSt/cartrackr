import { CarFront } from "lucide-react";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  if (!isAuth0Configured || !auth0) {
    redirect("/");
  }

  try {
    const session = await auth0.getSession();
    if (session) {
      redirect("/");
    }
  } catch {
    // Stale cookie — just show the login page
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-background)] px-6">
      <div className="w-full max-w-xs text-center">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary)] text-white shadow-lg shadow-blue-900/25">
            <CarFront size={38} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
            CarTrackr
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            Track your car costs with ease
          </p>
        </div>

        <a
          href="/auth/login"
          className="flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
        >
          Get Started
        </a>

        <p className="mt-6 text-xs text-[var(--color-text-muted)]">
          Sign in with Google, Facebook, or email
        </p>
      </div>
    </div>
  );
}
