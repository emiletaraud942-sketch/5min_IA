import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-4xl">🧭</span>
      <h1 className="text-xl font-bold text-brand-950">Page introuvable</h1>
      <p className="text-brand-700">
        Cette page n&apos;existe pas ou plus. Retourne sur ton tableau de bord pour
        continuer.
      </p>
      <LinkButton href="/dashboard">Retour au tableau de bord</LinkButton>
      <Link href="/" className="text-sm text-brand-600 underline underline-offset-2">
        Ou revenir à l&apos;accueil
      </Link>
    </main>
  );
}
