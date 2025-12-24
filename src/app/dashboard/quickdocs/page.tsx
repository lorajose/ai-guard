"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { useLocale } from "@/contexts/LocaleProvider";
import { useEffect, useMemo, useState } from "react";
import type { ContractData, InvoiceData, ProposalData } from "@/quickdocs/types";

const copy = {
  es: {
    eyebrow: "IDEA · QuickDocs",
    title: "Documentos profesionales sin diseñar nada.",
    subtitle:
      "Rellena 5 campos y descarga un PDF elegante en segundos. Ideal para freelancers, técnicos y pequeños negocios.",
    stepsTitle: "MVP exacto",
    steps: [
      "Login",
      "Selección de documento",
      "Formulario corto",
      "PDF descargable",
      "Historial",
      "Stripe (planes)",
      "Landing simple",
    ],
    docsTitle: "Tipos de documentos (MVP)",
    docs: [
      "Factura",
      "Propuesta comercial",
      "Contrato simple de servicios",
      "Cotización / presupuesto",
    ],
    pricingTitle: "Planes",
    plans: [
      { name: "Starter", price: "$7/mes", note: "10 documentos" },
      { name: "Pro", price: "$15/mes", note: "Ilimitados" },
      { name: "White‑Label", price: "$29/mes", note: "Logo + colores" },
    ],
    locked: "Disponible según tu plan.",
    cta: "Ver planes",
  },
  en: {
    eyebrow: "IDEA · QuickDocs",
    title: "Professional documents without designing anything.",
    subtitle:
      "Fill 5 fields and download a polished PDF in seconds. Ideal for freelancers and small businesses.",
    stepsTitle: "MVP checklist",
    steps: [
      "Login",
      "Document selection",
      "Short form",
      "Downloadable PDF",
      "History",
      "Stripe (plans)",
      "Simple landing",
    ],
    docsTitle: "Document types (MVP)",
    docs: [
      "Invoice",
      "Business proposal",
      "Simple service contract",
      "Quote / estimate",
    ],
    pricingTitle: "Plans",
    plans: [
      { name: "Starter", price: "$7/mo", note: "10 documents" },
      { name: "Pro", price: "$15/mo", note: "Unlimited" },
      { name: "White‑Label", price: "$29/mo", note: "Logo + colors" },
    ],
    locked: "Available based on your plan.",
    cta: "View plans",
  },
};

export default function QuickDocsPage() {
  const { locale } = useLocale();
  const t = copy[locale];
  const labels = {
    es: {
      preview: "Vista previa",
      downloadInvoice: "Descargar factura PDF",
      downloadProposal: "Descargar propuesta PDF",
      downloadContract: "Descargar contrato PDF",
      branding: "Branding (solo plan Pro)",
      logoUrl: "Logo (URL)",
      primaryColor: "Color primario",
      secondaryColor: "Color secundario",
      hideBranding: "Quitar marca QuickDocs",
      history: "Historial reciente",
      historyEmpty: "Aún no has generado documentos.",
      invoiceHeroTitle: "Factura Express",
      invoiceHeroSubtitle:
        "Completa la misión en 60 segundos: una factura moderna, clara y lista para cobrar.",
      invoiceProgressLabel: "Progreso",
      invoiceNextLabel: "Siguiente objetivo",
      invoiceStatusLabel: "Ruta de cobro",
      invoiceStatus: {
        created: "Creada",
        sent: "Enviada",
        waiting: "En espera de pago",
        paid: "Pagada",
      },
      invoiceMission: {
        issuer: "Tu marca y contacto",
        client: "Cliente que paga",
        details: "Servicio y precio",
        payment: "Fecha límite",
        final: "Factura lista",
      },
      invoiceLabels: {
        itemDescription: "Descripción del servicio",
        itemQuantity: "Cantidad",
        itemUnitPrice: "Precio por unidad",
        taxPercent: "Impuesto (%)",
        note: "Mensaje final",
        clientPhone: "Teléfono del cliente",
        clientAddress: "Dirección del cliente",
        policy: "Política general (NY)",
        logo: "Logo (puedes cambiarlo)",
        logoUpload: "Subir logo",
        issuerName: "Tu nombre o marca",
        issuerEmail: "Correo para cobrar",
        issuerPhone: "Teléfono / WhatsApp",
        issuerAddress: "Dirección comercial",
        clientName: "Cliente que paga",
        clientEmail: "Email del cliente",
        dueDate: "Fecha límite",
        addItem: "Agregar otro servicio",
        removeItem: "Eliminar",
      },
      tabs: {
        invoice: "Factura",
        proposal: "Propuesta",
        contract: "Contrato",
      },
      invoicePlaceholders: {
        issuerName: "Tu nombre o marca (ej: Studio Rivera)",
        issuerEmail: "Correo para cobrar (ej: hola@tuempresa.com)",
        issuerPhone: "Teléfono / WhatsApp",
        issuerAddress: "Dirección comercial (opcional)",
        issuerLogoUrl: "Logo (URL)",
        clientName: "Cliente que paga (ej: Carlos Pérez)",
        clientEmail: "Email del cliente (para enviar la factura)",
        clientPhone: "Teléfono del cliente",
        clientAddress: "Dirección del cliente",
        dueDate: "Fecha límite de pago",
        itemDescription: "Qué entregaste (ej: Diseño de logo + 3 revisiones)",
        itemQuantity: "Cantidad",
        itemUnitPrice: "Precio por unidad (USD)",
        taxPercent: "Impuesto (%)",
        note: "Mensaje final (ej: Gracias por confiar en nosotros)",
        policy: "Política general (NY)",
      },
    },
    en: {
      preview: "Preview",
      downloadInvoice: "Download invoice PDF",
      downloadProposal: "Download proposal PDF",
      downloadContract: "Download contract PDF",
      branding: "Branding (Pro plan only)",
      logoUrl: "Logo (URL)",
      primaryColor: "Primary color",
      secondaryColor: "Secondary color",
      hideBranding: "Remove QuickDocs branding",
      history: "Recent history",
      historyEmpty: "No documents yet.",
      invoiceHeroTitle: "Invoice Sprint",
      invoiceHeroSubtitle:
        "Complete the mission in 60 seconds: a modern invoice that gets you paid.",
      invoiceProgressLabel: "Progress",
      invoiceNextLabel: "Next target",
      invoiceStatusLabel: "Payment route",
      invoiceStatus: {
        created: "Created",
        sent: "Sent",
        waiting: "Waiting on payment",
        paid: "Paid",
      },
      invoiceMission: {
        issuer: "Brand & contact",
        client: "Paying client",
        details: "Service & price",
        payment: "Due date",
        final: "Invoice ready",
      },
      invoiceLabels: {
        itemDescription: "Service description",
        itemQuantity: "Quantity",
        itemUnitPrice: "Unit price",
        taxPercent: "Tax (%)",
        note: "Final message",
        clientPhone: "Client phone",
        clientAddress: "Client address",
        policy: "General policy (NY)",
        logo: "Logo (you can replace it)",
        logoUpload: "Upload logo",
        issuerName: "Your name or brand",
        issuerEmail: "Billing email",
        issuerPhone: "Phone / WhatsApp",
        issuerAddress: "Business address",
        clientName: "Paying client",
        clientEmail: "Client email",
        dueDate: "Due date",
        addItem: "Add another service",
        removeItem: "Remove",
      },
      tabs: {
        invoice: "Invoice",
        proposal: "Proposal",
        contract: "Contract",
      },
      invoicePlaceholders: {
        issuerName: "Your name or brand (e.g. Studio Rivera)",
        issuerEmail: "Billing email (e.g. hello@company.com)",
        issuerPhone: "Phone / WhatsApp",
        issuerAddress: "Business address (optional)",
        issuerLogoUrl: "Logo (URL)",
        clientName: "Paying client (e.g. Carlos Perez)",
        clientEmail: "Client email (to send invoice)",
        clientPhone: "Client phone",
        clientAddress: "Client address",
        dueDate: "Payment due date",
        itemDescription: "What did you deliver (e.g. Logo design + 3 revisions)",
        itemQuantity: "Quantity",
        itemUnitPrice: "Unit price (USD)",
        taxPercent: "Tax (%)",
        note: "Final note (e.g. Thanks for your business)",
        policy: "General policy (NY)",
      },
    },
  }[locale];

  const [tab, setTab] = useState<"invoice" | "proposal" | "contract">("invoice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<
    {
      id: string;
      type: string;
      title: string;
      created_at: string;
      payload?: { status?: InvoiceData["status"] };
    }[]
  >([]);
  const [plan, setPlan] = useState<{ plan: string; isPro: boolean } | null>(null);
  const [branding, setBranding] = useState({
    logoUrl: "",
    primaryColor: "#111827",
    secondaryColor: "#6B7280",
    removeBranding: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const invoiceNumber = useMemo(() => `INV-${Date.now()}`, []);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [invoice, setInvoice] = useState({
    issuerName: "",
    issuerEmail: "",
    issuerPhone: "",
    issuerAddress: "",
    issuerLogoUrl: "/quickdocs/logo-default.svg",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    dueDate: "",
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
    taxPercent: 0,
    note: "",
    policy:
      "Todas las facturas se rigen por las leyes del Estado de New York. Los pagos vencidos pueden generar cargos por demora.",
    status: "created" as InvoiceData["status"],
  });

  const [proposal, setProposal] = useState({
    providerName: "",
    providerEmail: "",
    providerPhone: "",
    clientName: "",
    clientCompany: "",
    title: "",
    summary: "",
    serviceA: "",
    serviceB: "",
    serviceC: "",
    total: "",
    validityDays: 15,
    terms: "",
  });

  const [contract, setContract] = useState({
    providerName: "",
    clientName: "",
    service: "",
    startDate: "",
    endDate: "",
    openEnded: false,
    amount: "",
    frequency: "one_time" as "one_time" | "monthly",
    liability: "La responsabilidad se limita al monto pagado por el cliente.",
    cancellation: "Cualquiera de las partes puede cancelar con 7 días de aviso.",
    signerName: "",
    signDate: "",
  });

  const invoiceProgress = useMemo(() => {
    const checkpoints = [
      {
        key: "issuer",
        label: labels.invoiceMission.issuer,
        done: Boolean(invoice.issuerName && invoice.issuerEmail),
      },
      {
        key: "client",
        label: labels.invoiceMission.client,
        done: Boolean(invoice.clientName),
      },
      {
        key: "details",
        label: labels.invoiceMission.details,
        done: invoice.items.some((item) => item.description),
      },
      {
        key: "payment",
        label: labels.invoiceMission.payment,
        done: invoice.items.some(
          (item) => item.unitPrice > 0 && item.quantity > 0
        ),
      },
    ];
    const completed = checkpoints.filter((item) => item.done).length;
    const percent = Math.round((completed / checkpoints.length) * 100);
    const next =
      checkpoints.find((item) => !item.done)?.label ||
      labels.invoiceMission.final;
    return { checkpoints, completed, percent, next };
  }, [invoice, labels.invoiceMission]);

  const statusOptions = [
    { id: "created", label: labels.invoiceStatus.created },
    { id: "sent", label: labels.invoiceStatus.sent },
    { id: "waiting", label: labels.invoiceStatus.waiting },
    { id: "paid", label: labels.invoiceStatus.paid },
  ] as const;

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await fetch("/api/user/plan");
        const data = await res.json();
        if (res.ok && data.plan) {
          setPlan({ plan: data.plan.plan, isPro: data.plan.isPro });
        }
      } catch {
        setPlan(null);
      }
    }

    async function loadHistory() {
      try {
        const res = await fetch("/api/quickdocs/history");
        const data = await res.json();
        if (res.ok) {
          setHistory(data.items || []);
        }
      } catch {
        setHistory([]);
      }
    }

    loadPlan();
    loadHistory();
  }, []);

  async function downloadPdf(payload: {
    type: "invoice" | "proposal" | "contract";
    data: InvoiceData | ProposalData | ContractData;
    filename: string;
  }) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quickdocs/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payload.type,
          data: payload.data,
          showBranding: plan?.isPro ? !branding.removeBranding : true,
          watermark: !plan?.isPro,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo generar el PDF.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = payload.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      await fetch("/api/quickdocs/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payload.type,
          title: payload.filename,
          data: payload.data,
        }),
      });
      const historyRes = await fetch("/api/quickdocs/history");
      const historyData = await historyRes.json();
      if (historyRes.ok) {
        setHistory(historyData.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando PDF.");
    } finally {
      setLoading(false);
    }
  }

  async function previewPdf(payload: {
    type: "invoice" | "proposal" | "contract";
    data: InvoiceData | ProposalData | ContractData;
  }) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quickdocs/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payload.type,
          data: payload.data,
          showBranding: plan?.isPro ? !branding.removeBranding : true,
          watermark: !plan?.isPro,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo generar el PDF.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando PDF.");
    } finally {
      setLoading(false);
    }
  }

  function handleInvoiceDownload() {
    const items = invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = (subtotal * invoice.taxPercent) / 100;
    const total = subtotal + taxAmount;
    const data: InvoiceData = {
      branding: plan?.isPro
        ? {
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
          }
        : undefined,
      status: invoice.status,
      issuer: {
        name: invoice.issuerName,
        email: invoice.issuerEmail,
        phone: invoice.issuerPhone,
        address: invoice.issuerAddress,
        logoUrl: plan?.isPro ? invoice.issuerLogoUrl || undefined : undefined,
      },
      client: {
        name: invoice.clientName,
        email: invoice.clientEmail || undefined,
        phone: invoice.clientPhone || undefined,
        address: invoice.clientAddress || undefined,
      },
      invoice: {
        number: invoiceNumber,
        issueDate: today,
        dueDate: invoice.dueDate || today,
      },
      items,
      tax: {
        percent: invoice.taxPercent || undefined,
        amount: taxAmount || undefined,
      },
      total: { amount: total, currency: "USD" },
      note: invoice.note || undefined,
      policy: invoice.policy || undefined,
    };
    downloadPdf({
      type: "invoice",
      data,
      filename: `factura-${invoiceNumber}.pdf`,
    });
  }

  function handleProposalDownload() {
    const services = [
      proposal.serviceA,
      proposal.serviceB,
      proposal.serviceC,
    ]
      .filter(Boolean)
      .map((name) => ({ name }));
    const data: ProposalData = {
      branding: plan?.isPro
        ? {
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
          }
        : undefined,
      provider: {
        name: proposal.providerName,
        email: proposal.providerEmail,
        phone: proposal.providerPhone,
        logoUrl: plan?.isPro ? branding.logoUrl || undefined : undefined,
      },
      client: {
        name: proposal.clientName,
        company: proposal.clientCompany || undefined,
      },
      proposal: {
        title: proposal.title,
        summary: proposal.summary,
      },
      services,
      total: proposal.total,
      validityDays: proposal.validityDays,
      terms: proposal.terms || undefined,
    };
    downloadPdf({ type: "proposal", data, filename: "propuesta.pdf" });
  }

  function handleContractDownload() {
    const data: ContractData = {
      branding: plan?.isPro
        ? {
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
          }
        : undefined,
      parties: {
        providerName: contract.providerName,
        clientName: contract.clientName,
      },
      service: {
        description: contract.service,
      },
      duration: {
        startDate: contract.startDate || today,
        endDate: contract.openEnded ? undefined : contract.endDate || today,
        openEnded: contract.openEnded,
      },
      payment: {
        amount: contract.amount,
        frequency: contract.frequency,
      },
      clauses: {
        liability: contract.liability,
        cancellation: contract.cancellation,
      },
      signature: {
        signerName: contract.signerName,
        date: contract.signDate || today,
      },
    };
    downloadPdf({ type: "contract", data, filename: "contrato.pdf" });
  }

  return (
    <DashboardShell>
      <section className="space-y-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm text-zinc-300">{t.subtitle}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
            <h2 className="text-lg font-semibold">{t.stepsTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {t.steps.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
            <h2 className="text-lg font-semibold">{t.docsTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {t.docs.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "invoice", label: labels.tabs.invoice },
              { id: "proposal", label: labels.tabs.proposal },
              { id: "contract", label: labels.tabs.contract },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as typeof tab)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  tab === item.id
                    ? "border-neonGreen bg-neonGreen text-white"
                    : "border-white/10 text-zinc-300 hover:border-white/30"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "invoice" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {labels.invoiceHeroTitle}
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                      {labels.invoiceHeroSubtitle}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs text-zinc-300">
                    {labels.invoiceProgressLabel}:{" "}
                    <span className="text-white">
                      {invoiceProgress.percent}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-neonGreen transition-all"
                    style={{ width: `${invoiceProgress.percent}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {invoiceProgress.checkpoints.map((checkpoint) => (
                    <span
                      key={checkpoint.key}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        checkpoint.done
                          ? "border-neonGreen/40 bg-neonGreen/10 text-neonGreen"
                          : "border-white/10 text-zinc-400"
                      }`}
                    >
                      {checkpoint.label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  {labels.invoiceNextLabel}:{" "}
                  <span className="text-white">{invoiceProgress.next}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceStatusLabel}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setInvoice((prev) => ({
                          ...prev,
                          status: option.id,
                        }))
                      }
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        invoice.status === option.id
                          ? "border-neonGreen bg-neonGreen text-white"
                          : "border-white/10 text-zinc-300 hover:border-white/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {statusOptions.map((option, index) => {
                    const isActive = invoice.status === option.id;
                    const isDone =
                      statusOptions.findIndex(
                        (item) => item.id === invoice.status
                      ) >= index;
                    return (
                      <div
                        key={option.id}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                            isActive
                              ? "border-neonGreen bg-neonGreen text-white"
                              : isDone
                              ? "border-neonGreen/40 bg-neonGreen/10 text-neonGreen"
                              : "border-white/10 text-zinc-500"
                          }`}
                        >
                          {option.id === "created" && "✅"}
                          {option.id === "sent" && "📨"}
                          {option.id === "waiting" && "⏳"}
                          {option.id === "paid" && "💰"}
                        </div>
                        <div className="text-xs text-zinc-300">
                          {option.label}
                        </div>
                        {index < statusOptions.length - 1 && (
                          <div className="h-6 w-px bg-white/10 sm:h-px sm:w-8" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.issuerName}
                </label>
                <input
                  value={invoice.issuerName}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, issuerName: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.issuerName}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.issuerEmail}
                </label>
                <input
                  value={invoice.issuerEmail}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, issuerEmail: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.issuerEmail}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.issuerPhone}
                </label>
                <input
                  value={invoice.issuerPhone}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, issuerPhone: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.issuerPhone}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.issuerAddress}
                </label>
                <input
                  value={invoice.issuerAddress}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, issuerAddress: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.issuerAddress}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.logo}
                </label>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    value={invoice.issuerLogoUrl}
                    onChange={(e) =>
                      setInvoice((prev) => ({
                        ...prev,
                        issuerLogoUrl: e.target.value,
                      }))
                    }
                    placeholder={labels.invoicePlaceholders.issuerLogoUrl}
                    className="flex-1 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30">
                    {labels.invoiceLabels.logoUpload}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setInvoice((prev) => ({
                            ...prev,
                            issuerLogoUrl: String(reader.result || ""),
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.clientName}
                </label>
                <input
                  value={invoice.clientName}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.clientName}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.clientEmail}
                </label>
                <input
                  value={invoice.clientEmail}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, clientEmail: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.clientEmail}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.clientPhone}
                </label>
                <input
                  value={invoice.clientPhone}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, clientPhone: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.clientPhone}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.clientAddress}
                </label>
                <input
                  value={invoice.clientAddress}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, clientAddress: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.clientAddress}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.dueDate}
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                {invoice.items.map((item, index) => (
                  <div
                    key={`item-${index}`}
                    className="grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 md:grid-cols-3"
                  >
                    <input
                      value={item.description}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          items: prev.items.map((entry, idx) =>
                            idx === index
                              ? { ...entry, description: e.target.value }
                              : entry
                          ),
                        }))
                      }
                      placeholder={labels.invoicePlaceholders.itemDescription}
                      className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-3"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          items: prev.items.map((entry, idx) =>
                            idx === index
                              ? { ...entry, quantity: Number(e.target.value) }
                              : entry
                          ),
                        }))
                      }
                      placeholder={labels.invoicePlaceholders.itemQuantity}
                      className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        setInvoice((prev) => ({
                          ...prev,
                          items: prev.items.map((entry, idx) =>
                            idx === index
                              ? { ...entry, unitPrice: Number(e.target.value) }
                              : entry
                          ),
                        }))
                      }
                      placeholder={labels.invoicePlaceholders.itemUnitPrice}
                      className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
                    />
                    <div className="flex items-center justify-between md:col-span-3">
                      <div className="flex gap-2 text-xs text-zinc-500">
                        <span>{labels.invoiceLabels.itemDescription}</span>
                        <span>•</span>
                        <span>{labels.invoiceLabels.itemQuantity}</span>
                        <span>•</span>
                        <span>{labels.invoiceLabels.itemUnitPrice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setInvoice((prev) => ({
                            ...prev,
                            items: prev.items.filter((_, idx) => idx !== index),
                          }))
                        }
                        disabled={invoice.items.length === 1}
                        className="text-xs text-red-300 hover:text-red-200 disabled:opacity-40"
                      >
                        {labels.invoiceLabels.removeItem}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setInvoice((prev) => ({
                      ...prev,
                      items: [
                        ...prev.items,
                        { description: "", quantity: 1, unitPrice: 0 },
                      ],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-white transition hover:border-white/30"
                >
                  + {labels.invoiceLabels.addItem}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.taxPercent}
                </label>
                <input
                  type="number"
                  value={invoice.taxPercent}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      taxPercent: Number(e.target.value),
                    }))
                  }
                  placeholder={labels.invoicePlaceholders.taxPercent}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.note}
                </label>
                <input
                  value={invoice.note}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.note}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">
                  {labels.invoiceLabels.policy}
                </label>
                <textarea
                  value={invoice.policy}
                  onChange={(e) =>
                    setInvoice((prev) => ({ ...prev, policy: e.target.value }))
                  }
                  placeholder={labels.invoicePlaceholders.policy}
                  className="min-h-[90px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </div>
              <button
                onClick={() => previewPdf({ type: "invoice", data: (() => {
                  const items = invoice.items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.quantity * item.unitPrice,
                  }));
                  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
                  const taxAmount = (subtotal * invoice.taxPercent) / 100;
                  const total = subtotal + taxAmount;
                  return {
                    branding: plan?.isPro
                      ? {
                          primaryColor: branding.primaryColor,
                          secondaryColor: branding.secondaryColor,
                        }
                      : undefined,
                    status: invoice.status,
                    issuer: {
                      name: invoice.issuerName,
                      email: invoice.issuerEmail,
                      phone: invoice.issuerPhone,
                      address: invoice.issuerAddress,
                      logoUrl: plan?.isPro ? invoice.issuerLogoUrl || undefined : undefined,
                    },
                    client: {
                      name: invoice.clientName,
                      email: invoice.clientEmail || undefined,
                      phone: invoice.clientPhone || undefined,
                      address: invoice.clientAddress || undefined,
                    },
                    invoice: {
                      number: invoiceNumber,
                      issueDate: today,
                      dueDate: invoice.dueDate || today,
                    },
                    items,
                    tax: {
                      percent: invoice.taxPercent || undefined,
                      amount: taxAmount || undefined,
                    },
                    total: { amount: total, currency: "USD" },
                    note: invoice.note || undefined,
                    policy: invoice.policy || undefined,
                  } as InvoiceData;
                })() })}
                disabled={loading}
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.preview}
              </button>
              <button
                onClick={handleInvoiceDownload}
                disabled={loading}
                className="rounded-2xl bg-neonGreen px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.downloadInvoice}
              </button>
            </div>
          )}

          {tab === "proposal" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={proposal.providerName}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, providerName: e.target.value }))
                }
                placeholder="Empresa / profesional"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.providerEmail}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, providerEmail: e.target.value }))
                }
                placeholder="Email"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.providerPhone}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, providerPhone: e.target.value }))
                }
                placeholder="Teléfono"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.clientName}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, clientName: e.target.value }))
                }
                placeholder="Nombre del cliente"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.clientCompany}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, clientCompany: e.target.value }))
                }
                placeholder="Empresa del cliente (opcional)"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.title}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Título de la propuesta"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <textarea
                value={proposal.summary}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="Descripción breve"
                className="min-h-[90px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <input
                value={proposal.serviceA}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, serviceA: e.target.value }))
                }
                placeholder="Servicio 1"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.serviceB}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, serviceB: e.target.value }))
                }
                placeholder="Servicio 2"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.serviceC}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, serviceC: e.target.value }))
                }
                placeholder="Servicio 3"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={proposal.total}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, total: e.target.value }))
                }
                placeholder="Total propuesto"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                type="number"
                value={proposal.validityDays}
                onChange={(e) =>
                  setProposal((prev) => ({
                    ...prev,
                    validityDays: Number(e.target.value),
                  }))
                }
                placeholder="Validez (días)"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <textarea
                value={proposal.terms}
                onChange={(e) =>
                  setProposal((prev) => ({ ...prev, terms: e.target.value }))
                }
                placeholder="Condiciones básicas"
                className="min-h-[80px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <button
                onClick={() => previewPdf({ type: "proposal", data: {
                  branding: plan?.isPro
                    ? {
                        primaryColor: branding.primaryColor,
                        secondaryColor: branding.secondaryColor,
                      }
                    : undefined,
                  provider: {
                    name: proposal.providerName,
                    email: proposal.providerEmail,
                    phone: proposal.providerPhone,
                    logoUrl: plan?.isPro ? branding.logoUrl || undefined : undefined,
                  },
                  client: {
                    name: proposal.clientName,
                    company: proposal.clientCompany || undefined,
                  },
                  proposal: {
                    title: proposal.title,
                    summary: proposal.summary,
                  },
                  services: [proposal.serviceA, proposal.serviceB, proposal.serviceC]
                    .filter(Boolean)
                    .map((name) => ({ name })),
                  total: proposal.total,
                  validityDays: proposal.validityDays,
                  terms: proposal.terms || undefined,
                } })}
                disabled={loading}
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.preview}
              </button>
              <button
                onClick={handleProposalDownload}
                disabled={loading}
                className="rounded-2xl bg-neonGreen px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.downloadProposal}
              </button>
            </div>
          )}

          {tab === "contract" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={contract.providerName}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, providerName: e.target.value }))
                }
                placeholder="Nombre del proveedor"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={contract.clientName}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, clientName: e.target.value }))
                }
                placeholder="Nombre del cliente"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <textarea
                value={contract.service}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, service: e.target.value }))
                }
                placeholder="Descripción del servicio"
                className="min-h-[90px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <input
                type="date"
                value={contract.startDate}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <input
                type="date"
                value={contract.endDate}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, endDate: e.target.value }))
                }
                disabled={contract.openEnded}
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={contract.openEnded}
                  onChange={(e) =>
                    setContract((prev) => ({
                      ...prev,
                      openEnded: e.target.checked,
                    }))
                  }
                />
                Duración indefinida
              </label>
              <input
                value={contract.amount}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="Monto"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <select
                value={contract.frequency}
                onChange={(e) =>
                  setContract((prev) => ({
                    ...prev,
                    frequency: e.target.value as "one_time" | "monthly",
                  }))
                }
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              >
                <option value="one_time">Pago único</option>
                <option value="monthly">Mensual</option>
              </select>
              <textarea
                value={contract.liability}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, liability: e.target.value }))
                }
                placeholder="Responsabilidad limitada"
                className="min-h-[80px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <textarea
                value={contract.cancellation}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, cancellation: e.target.value }))
                }
                placeholder="Cancelación"
                className="min-h-[80px] rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <input
                value={contract.signerName}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, signerName: e.target.value }))
                }
                placeholder="Nombre del firmante"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                type="date"
                value={contract.signDate}
                onChange={(e) =>
                  setContract((prev) => ({ ...prev, signDate: e.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <button
                onClick={() => previewPdf({ type: "contract", data: {
                  branding: plan?.isPro
                    ? {
                        primaryColor: branding.primaryColor,
                        secondaryColor: branding.secondaryColor,
                      }
                    : undefined,
                  parties: {
                    providerName: contract.providerName,
                    clientName: contract.clientName,
                  },
                  service: {
                    description: contract.service,
                  },
                  duration: {
                    startDate: contract.startDate || today,
                    endDate: contract.openEnded ? undefined : contract.endDate || today,
                    openEnded: contract.openEnded,
                  },
                  payment: {
                    amount: contract.amount,
                    frequency: contract.frequency,
                  },
                  clauses: {
                    liability: contract.liability,
                    cancellation: contract.cancellation,
                  },
                  signature: {
                    signerName: contract.signerName,
                    date: contract.signDate || today,
                  },
                } })}
                disabled={loading}
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.preview}
              </button>
              <button
                onClick={handleContractDownload}
                disabled={loading}
                className="rounded-2xl bg-neonGreen px-5 py-3 text-sm font-semibold text-white md:col-span-2"
              >
                {labels.downloadContract}
              </button>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </section>

        {plan?.isPro && (
          <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
            <h2 className="text-lg font-semibold">{labels.branding}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                value={branding.logoUrl}
                onChange={(e) =>
                  setBranding((prev) => ({ ...prev, logoUrl: e.target.value }))
                }
                placeholder={labels.logoUrl}
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={branding.primaryColor}
                onChange={(e) =>
                  setBranding((prev) => ({
                    ...prev,
                    primaryColor: e.target.value,
                  }))
                }
                placeholder={labels.primaryColor}
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={branding.secondaryColor}
                onChange={(e) =>
                  setBranding((prev) => ({
                    ...prev,
                    secondaryColor: e.target.value,
                  }))
                }
                placeholder={labels.secondaryColor}
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={branding.removeBranding}
                  onChange={(e) =>
                    setBranding((prev) => ({
                      ...prev,
                      removeBranding: e.target.checked,
                    }))
                  }
                />
                {labels.hideBranding}
              </label>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
          <h2 className="text-lg font-semibold">{labels.history}</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            {history.length === 0 && <p>{labels.historyEmpty}</p>}
            {history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/60 p-3"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-zinc-400">
                  {item.type} · {new Date(item.created_at).toLocaleString()}
                </p>
                {item.payload?.status && (
                  <span className="w-fit rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[11px] text-zinc-300">
                    {labels.invoiceStatus[item.payload.status]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="relative h-[85vh] w-full max-w-4xl rounded-3xl border border-white/10 bg-black p-4">
              <button
                onClick={() => {
                  window.URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
                className="absolute right-4 top-4 text-sm text-zinc-300 hover:text-white"
              >
                ✕
              </button>
              <iframe
                title="Vista previa PDF"
                src={previewUrl}
                className="h-full w-full rounded-2xl border border-white/10"
              />
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
          <h2 className="text-lg font-semibold">{t.pricingTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <p className="text-sm uppercase tracking-wide text-zinc-500">
                  {plan.name}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{plan.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-400">{t.locked}</p>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-neonGreen px-5 py-2 text-sm font-semibold text-white"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
