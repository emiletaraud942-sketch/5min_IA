import Stripe from "stripe";

export const LESSON_UNLOCK_PRICE_CENTS = 100; // 1€

let client: Stripe | null = null;

export function getStripeClient() {
  if (!client) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY manquante côté serveur.");
    }
    client = new Stripe(secretKey);
  }
  return client;
}
