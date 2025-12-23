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
    },
  }[locale];

  const [tab, setTab] = useState<"invoice" | "proposal" | "contract">("invoice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<
    { id: string; type: string; title: string; created_at: string }[]
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
    clientName: "",
    clientEmail: "",
    dueDate: "",
    itemDescription: "",
    itemQuantity: 1,
    itemUnitPrice: 0,
    taxPercent: 0,
    note: "",
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
    const subtotal = invoice.itemQuantity * invoice.itemUnitPrice;
    const taxAmount = (subtotal * invoice.taxPercent) / 100;
    const total = subtotal + taxAmount;
    const data: InvoiceData = {
      branding: plan?.isPro
        ? {
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
          }
        : undefined,
      issuer: {
        name: invoice.issuerName,
        email: invoice.issuerEmail,
        phone: invoice.issuerPhone,
        address: invoice.issuerAddress,
        logoUrl: plan?.isPro ? branding.logoUrl || undefined : undefined,
      },
      client: {
        name: invoice.clientName,
        email: invoice.clientEmail || undefined,
      },
      invoice: {
        number: invoiceNumber,
        issueDate: today,
        dueDate: invoice.dueDate || today,
      },
      items: [
        {
          description: invoice.itemDescription,
          quantity: invoice.itemQuantity,
          unitPrice: invoice.itemUnitPrice,
          subtotal,
        },
      ],
      tax: {
        percent: invoice.taxPercent || undefined,
        amount: taxAmount || undefined,
      },
      total: { amount: total, currency: "USD" },
      note: invoice.note || undefined,
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
              { id: "invoice", label: "Factura" },
              { id: "proposal", label: "Propuesta" },
              { id: "contract", label: "Contrato" },
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
              <input
                value={invoice.issuerName}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, issuerName: e.target.value }))
                }
                placeholder="Nombre empresa / profesional"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={invoice.issuerEmail}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, issuerEmail: e.target.value }))
                }
                placeholder="Email"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={invoice.issuerPhone}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, issuerPhone: e.target.value }))
                }
                placeholder="Teléfono"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={invoice.issuerAddress}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, issuerAddress: e.target.value }))
                }
                placeholder="Dirección"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={invoice.clientName}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, clientName: e.target.value }))
                }
                placeholder="Nombre del cliente"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                value={invoice.clientEmail}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, clientEmail: e.target.value }))
                }
                placeholder="Email del cliente (opcional)"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <input
                value={invoice.itemDescription}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, itemDescription: e.target.value }))
                }
                placeholder="Descripción del ítem"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <input
                type="number"
                value={invoice.itemQuantity}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, itemQuantity: Number(e.target.value) }))
                }
                placeholder="Cantidad"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <input
                type="number"
                value={invoice.itemUnitPrice}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, itemUnitPrice: Number(e.target.value) }))
                }
                placeholder="Precio unitario"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <input
                type="number"
                value={invoice.taxPercent}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, taxPercent: Number(e.target.value) }))
                }
                placeholder="Impuesto (%)"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white"
              />
              <input
                value={invoice.note}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Nota final"
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 md:col-span-2"
              />
              <button
                onClick={() => previewPdf({ type: "invoice", data: (() => {
                  const subtotal = invoice.itemQuantity * invoice.itemUnitPrice;
                  const taxAmount = (subtotal * invoice.taxPercent) / 100;
                  const total = subtotal + taxAmount;
                  return {
                    branding: plan?.isPro
                      ? {
                          primaryColor: branding.primaryColor,
                          secondaryColor: branding.secondaryColor,
                        }
                      : undefined,
                    issuer: {
                      name: invoice.issuerName,
                      email: invoice.issuerEmail,
                      phone: invoice.issuerPhone,
                      address: invoice.issuerAddress,
                      logoUrl: plan?.isPro ? branding.logoUrl || undefined : undefined,
                    },
                    client: {
                      name: invoice.clientName,
                      email: invoice.clientEmail || undefined,
                    },
                    invoice: {
                      number: invoiceNumber,
                      issueDate: today,
                      dueDate: invoice.dueDate || today,
                    },
                    items: [
                      {
                        description: invoice.itemDescription,
                        quantity: invoice.itemQuantity,
                        unitPrice: invoice.itemUnitPrice,
                        subtotal,
                      },
                    ],
                    tax: {
                      percent: invoice.taxPercent || undefined,
                      amount: taxAmount || undefined,
                    },
                    total: { amount: total, currency: "USD" },
                    note: invoice.note || undefined,
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
