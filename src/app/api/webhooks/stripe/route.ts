import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Stripe signature verification failed", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription) return;
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  const userId =
    session.metadata?.user_id ||
    session.metadata?.supabase_user_id ||
    subscription.metadata?.user_id;
  if (!userId) return;

  const plan = planFromPrice(subscription.items.data[0]?.price.id);
  await upsertSubscriptionRecord({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    price_id: subscription.items.data[0]?.price.id ?? "",
    plan_name: plan,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    trial_end: subscription.trial_end,
  });
  await syncUserMetadata(userId, subscription, plan);
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  const userId = subscription.metadata?.user_id || data?.user_id;
  if (!userId) return;

  const plan = planFromPrice(subscription.items.data[0]?.price.id);
  await upsertSubscriptionRecord({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    price_id: subscription.items.data[0]?.price.id ?? "",
    plan_name: plan,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    trial_end: subscription.trial_end,
  });
  await syncUserMetadata(userId, subscription, plan);
}

async function syncUserMetadata(
  userId: string,
  subscription: Stripe.Subscription,
  plan: string
) {
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      plan,
      plan_status: subscription.status,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    },
  });
}

function planFromPrice(priceId?: string | null) {
  if (!priceId) return "LITE";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_ID_LITE) return "LITE";
  return "LITE";
}

async function upsertSubscriptionRecord(params: {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  price_id: string;
  plan_name: string;
  status: string;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  trial_end: number | null;
}) {
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: params.user_id,
      stripe_customer_id: params.stripe_customer_id,
      stripe_subscription_id: params.stripe_subscription_id,
      price_id: params.price_id,
      plan_name: params.plan_name,
      status: params.status,
      trial_end: params.trial_end
        ? new Date(params.trial_end * 1000).toISOString()
        : null,
      cancel_at_period_end: params.cancel_at_period_end,
      current_period_end: params.current_period_end
        ? new Date(params.current_period_end * 1000).toISOString()
        : null,
    },
    { onConflict: "stripe_subscription_id" }
  );
}
