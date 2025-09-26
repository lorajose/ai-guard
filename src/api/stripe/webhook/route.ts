import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // para uso de raw body si usas edge cambia según hosting

export async function POST(req: any) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });
  const sig = req.headers.get("stripe-signature") as string;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const subId = s.subscription as string; // sub_*
        const customerId = s.customer as string; // cus_*
        const userId = s.metadata?.supabase_user_id || null;
        const plan = (s.metadata?.plan || "").toUpperCase(); // LITE | PRO

        // Obtenemos la suscripción real para fechas/estado/price_id robusto
        const subscriptionResponse = await stripe.subscriptions.retrieve(subId);
        const subscription =
          (subscriptionResponse as any).data ??
          (subscriptionResponse as Stripe.Subscription);

        if (userId) {
          await upsertSubscription({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            price_id: subscription.items.data[0]?.price.id!,
            plan_name:
              plan || planFromPrice(subscription.items.data[0]?.price.id),
            status: subscription.status as any,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Recuperar la suscripción completa para asegurar campos consistentes
        const fullResp = await stripe.subscriptions.retrieve(sub.id);
        const fullSub =
          (fullResp as any).data ?? (fullResp as Stripe.Subscription);

        await upsertByCustomer(customerId, {
          stripe_subscription_id: fullSub.id,
          price_id: fullSub.items.data[0]?.price.id,
          plan_name: planFromPrice(fullSub.items.data[0]?.price.id),
          status: fullSub.status as any,
          current_period_end: new Date(
            fullSub.current_period_end * 1000
          ).toISOString(),
        });
        break;
      }
    }
  } catch (e: any) {
    console.error("Webhook handler error:", e);
    return NextResponse.json(
      { received: true, error: e.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

function planFromPrice(priceId?: string | null) {
  if (!priceId) return "LITE";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return "PRO";
  return "LITE";
}

async function upsertSubscription(payload: {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  price_id: string;
  plan_name: string;
  status: string;
  current_period_end: string;
}) {
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: payload.user_id,
      stripe_customer_id: payload.stripe_customer_id,
      stripe_subscription_id: payload.stripe_subscription_id,
      price_id: payload.price_id,
      plan_name: payload.plan_name,
      status: payload.status,
      current_period_end: payload.current_period_end,
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function upsertByCustomer(
  customerId: string,
  patch: Partial<{
    stripe_subscription_id: string;
    price_id: string;
    plan_name: string;
    status: string;
    current_period_end: string;
  }>
) {
  // Encontrar fila por customer y actualizar
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (data?.id) {
    await supabaseAdmin.from("subscriptions").update(patch).eq("id", data.id);
  }
}
