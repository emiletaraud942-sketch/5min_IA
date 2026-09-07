"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function Logo() {
  return (
    <Link href="/" className="mb-8 inline-block font-semibold tracking-tight text-brand-900">
      5min<span className="text-brand-500">IA</span>
    </Link>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : error.message,
      );
      return;
    }

    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }

    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 text-center">
        <Logo />
        <h1 className="mb-2 text-2xl font-bold text-brand-950">Vérifie ta boîte mail</h1>
        <p className="text-sm text-brand-700">
          On t&apos;a envoyé un lien de confirmation à <strong>{email}</strong>. Clique
          dessus pour activer ton compte, puis reviens te connecter.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Logo />
      <h1 className="mb-1 text-2xl font-bold text-brand-950">Crée ton compte</h1>
      <p className="mb-6 text-sm text-brand-700">
        Moins de 5 minutes par jour pour ne plus être largué par l&apos;IA.
      </p>
      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-900">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-900">
            Mot de passe
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-brand-700">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-semibold text-brand-800 underline">
          Connecte-toi
        </Link>
      </p>
    </main>
  );
}
