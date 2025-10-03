// src/app/pricing/page.tsx
import Pricing from "@/components/Pricing";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-20">
      <h1 className="text-center text-4xl font-bold mb-12">Planes y precios</h1>
      <Pricing />
    </main>
  );
}
