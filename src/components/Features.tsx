export default function Features() {
  const list = [
    "Detecta estafas en SMS, WhatsApp, Telegram o redes sociales",
    "Analiza llamadas falsas con IA (audio → texto → veredicto)",
    "Protección contra phishing en correos (plan Pro)",
    "Alertas instantáneas por Email, Telegram o Slack",
  ];

  return (
    <section className="px-6 py-20 text-center">
      <h2 className="text-3xl font-bold mb-8">¿Por qué elegirnos?</h2>
      <ul className="mx-auto max-w-2xl space-y-4 text-left">
        {list.map((f) => (
          <li
            key={f}
            className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
          >
            {f}
          </li>
        ))}
      </ul>
    </section>
  );
}
