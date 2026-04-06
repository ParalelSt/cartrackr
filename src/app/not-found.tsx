import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold text-[var(--color-primary)]">404</h1>
      <p className="mt-3 text-lg font-semibold text-[var(--color-text)]">
        Page not found
      </p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
      >
        Go Home
      </Link>
    </div>
  );
}
