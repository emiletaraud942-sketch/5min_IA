import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/onboarding");

  return (
    <>
      <Navbar loggedIn />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <h1 className="mb-1 text-2xl font-bold text-brand-950">Mon profil</h1>
        <p className="mb-6 text-sm text-brand-700">
          Modifie tes réponses à tout moment, ça change immédiatement les leçons
          affichées.
        </p>
        <ProfileForm profile={profile} />
      </main>
    </>
  );
}
