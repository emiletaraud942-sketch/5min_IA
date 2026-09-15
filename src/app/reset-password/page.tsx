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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(
        "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré — redemandes-en un.",
      );
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50/60 to-sand-50">
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 text-center">
          <Logo />
          <h1 className="mb-2 text-2xl font-bold text-brand-950">Mot de passe mis à jour ✅</h1>
          <p className="text-sm text-brand-700">Redirection en cours...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50/60 to-sand-50">
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
        <Logo />
        <h1 className="mb-1 text-2xl font-bold text-brand-950">Choisis un nouveau mot de passe</h1>
        <p className="mb-6 text-sm text-brand-700">
          Tu dois avoir cliqué sur le lien reçu par email pour arriver ici.
        </p>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm font-medium text-brand-900">
              Nouveau mot de passe
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
            <label className="flex flex-col gap-1 text-sm font-medium text-brand-900">
              Confirme le mot de passe
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-lg border border-sand-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
