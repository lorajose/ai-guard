import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SUCCESS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`;
const CANCEL_URL = `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`;

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
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
    ...payload,
  });

  return NextResponse.json({ url: session.url });
}
