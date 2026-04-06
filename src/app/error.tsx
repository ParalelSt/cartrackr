"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold text-[var(--color-danger)]">Oops</h1>
      <p className="mt-3 text-lg font-semibold text-[var(--color-text)]">
        Something went wrong
      </p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--color-primary-light)] active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}
