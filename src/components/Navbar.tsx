import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b border-sand-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="shrink-0 font-semibold tracking-tight text-brand-900"
        >
          5min<span className="text-brand-500">IA</span>
        </Link>
        {loggedIn ? (
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Aujourd&apos;hui
            </Link>
            <Link
              href="/lessons"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Leçons
            </Link>
            <Link
              href="/progress"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Progression
            </Link>
            <SignOutButton />
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Commencer
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
