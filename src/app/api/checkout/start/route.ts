import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const FALLBACK_APP_URL = "http://localhost:3000";

function getBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }
  return FALLBACK_APP_URL;
}

export async function POST(req: Request) {
  const { plan = "LITE" } = await req.json();
  const priceId =
    plan === "PRO"
      ? process.env.STRIPE_PRICE_ID_PRO
      : process.env.STRIPE_PRICE_ID_LITE;

  if (!priceId) {
    return NextResponse.json(
      { error: "Plan no disponible. Revisa configuración de precios." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const baseUrl = getBaseUrl();
  const successUrl = `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/pricing`;
  const planType = plan.toLowerCase();
  const payload = {
    metadata: {
      user_id: user.id,
      plan_type: planType,
    },
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.user_metadata?.stripe_customer_id,
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: payload.metadata,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...payload,
  });

  return NextResponse.json({ url: session.url });
}
