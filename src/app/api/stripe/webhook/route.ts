import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      metadata: Record<string, string> | null;
      payment_status: string;
    };

    const userId = session.metadata?.userId;
    const lessonId = session.metadata?.lessonId;

    if (userId && lessonId && session.payment_status === "paid") {
      const admin = createAdminClient();
      const { error } = await admin.from("lesson_unlocks").upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          stripe_session_id: session.id,
        },
        { onConflict: "user_id,lesson_id" },
      );

      if (error) {
        console.error("Failed to record lesson unlock from webhook", error);
        return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
