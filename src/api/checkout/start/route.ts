// src/app/api/checkout/start/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Si quieres bloquear edge, fuerza Node.js:
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

function getOrigin(req: NextRequest) {
  // Vercel/Proxy-safe
  const h = req.headers;
  return h.get("x-forwarded-proto") && h.get("x-forwarded-host")
    ? `${h.get("x-forwarded-proto")}://${h.get("x-forwarded-host")}`
    : h.get("origin") || "http://localhost:3000";
}

export async function OPTIONS() {
  // Preflight simple (si llamas desde el browser)
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan as "LITE" | "PRO") || "LITE";

    const priceId =
      plan === "PRO"
        ? process.env.STRIPE_PRICE_ID_PRO!
        : process.env.STRIPE_PRICE_ID_LITE!;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe priceId not configured" },
        { status: 400 }
      );
    }

    // Autenticación usuario Supabase (si estás usando auth desde el cliente)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") || "" },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: `${origin}/dashboard?status=success`,
      cancel_url: `${origin}/pricing?status=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/start] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
