"use client";

import Link from "next/link";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Impossible d'envoyer l'email, réessaie.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50/60 to-sand-50">
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 text-center">
          <Logo />
          <h1 className="mb-2 text-2xl font-bold text-brand-950">Vérifie ta boîte mail</h1>
          <p className="text-sm text-brand-700">
            Si un compte existe pour <strong>{email}</strong>, tu vas recevoir un lien pour
            choisir un nouveau mot de passe.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50/60 to-sand-50">
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
        <Logo />
        <h1 className="mb-1 text-2xl font-bold text-brand-950">Mot de passe oublié</h1>
        <p className="mb-6 text-sm text-brand-700">
          Indique ton email, on t&apos;envoie un lien pour en choisir un nouveau.
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
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-brand-700">
          <Link href="/login" className="font-semibold text-brand-800 underline">
            Retour à la connexion
          </Link>
        </p>
      </main>
    </div>
  );
}
