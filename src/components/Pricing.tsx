export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20 text-center">
      <h2 className="text-3xl font-bold mb-8">Planes</h2>
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-xl font-semibold">Lite</h3>
          <p className="mt-2 text-3xl font-bold">$10/mes</p>
          <p className="mt-2 text-zinc-400">
            Protege contra estafas en llamadas y redes sociales
          </p>
        </div>
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2 text-3xl font-bold">$20/mes</p>
          <p className="mt-2 text-zinc-400">
            Incluye protección avanzada de emails y phishing
          </p>
        </div>
      </div>
    </section>
  );
}
