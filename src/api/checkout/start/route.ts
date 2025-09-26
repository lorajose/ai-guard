import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json(); // 'LITE' | 'PRO'
    const priceId =
      plan === "PRO"
        ? process.env.STRIPE_PRICE_ID_PRO!
        : process.env.STRIPE_PRICE_ID_LITE!;

    // Autenticación de usuario (ejemplo: token de Supabase en cookies)
    // Si usas @supabase/auth-helpers-nextjs, puedes obtener el user de la request.
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
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Creamos/reciclamos customer en Stripe (lo guardamos en subscriptions vía webhook)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: `${req.nextUrl.origin}/dashboard?status=success`,
      cancel_url: `${req.nextUrl.origin}/pricing?status=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
