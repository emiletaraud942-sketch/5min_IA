import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient, LESSON_UNLOCK_PRICE_CENTS } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const lessonId = body?.lessonId;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId manquant." }, { status: 400 });
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, titre, groupe")
    .eq("id", lessonId)
    .single();

  if (!lesson || !lesson.groupe) {
    return NextResponse.json(
      { error: "Cette leçon n'est pas une leçon payante." },
      { status: 400 },
    );
  }

  const { data: existingUnlock } = await supabase
    .from("lesson_unlocks")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existingUnlock) {
    return NextResponse.json({ error: "Cette leçon est déjà débloquée." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  let session;
  try {
    session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Leçon débloquée : ${lesson.titre}` },
            unit_amount: LESSON_UNLOCK_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id, lessonId },
      success_url: `${origin}/lesson/${lessonId}?debloque=1`,
      cancel_url: `${origin}/lesson/${lessonId}`,
    });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Le paiement est indisponible pour l'instant, réessaie plus tard." },
      { status: 502 },
    );
  }

  if (!session.url) {
    return NextResponse.json({ error: "Impossible de démarrer le paiement." }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
