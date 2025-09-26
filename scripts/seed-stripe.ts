import "dotenv/config"; // 👈 importa dotenv
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("❌ STRIPE_SECRET_KEY no está definido en .env.local");
  }

  console.log(
    "✅ Clave cargada:",
    process.env.STRIPE_SECRET_KEY.slice(0, 8) + "..."
  );

  const productLite = await stripe.products.create({ name: "IA Shield Lite" });
  const priceLite = await stripe.prices.create({
    unit_amount: 1000, // $10
    currency: "usd",
    recurring: { interval: "month" },
    product: productLite.id,
  });

  const productPro = await stripe.products.create({ name: "IA Shield Pro" });
  const pricePro = await stripe.prices.create({
    unit_amount: 2000, // $20
    currency: "usd",
    recurring: { interval: "month" },
    product: productPro.id,
  });

  console.log("🎉 Lite:", productLite.id, priceLite.id);
  console.log("🎉 Pro:", productPro.id, pricePro.id);
}

main().catch(console.error);
