import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ContractData, InvoiceData, ProposalData } from "@/quickdocs/types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 11,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  column: {
    flexDirection: "column",
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  label: {
    fontSize: 9,
    textTransform: "uppercase",
    color: "#6B7280",
    letterSpacing: 1,
  },
  muted: {
    color: "#6B7280",
  },
  section: {
    marginTop: 20,
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableHeader: {
    backgroundColor: "#F9FAFB",
    fontWeight: 700,
  },
  tableCell: {
    flex: 1,
  },
  tableCellSmall: {
    width: 60,
    textAlign: "right",
  },
  tableCellMedium: {
    width: 80,
    textAlign: "right",
  },
  totalsBox: {
    marginTop: 12,
    marginLeft: "auto",
    width: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  footer: {
    marginTop: 24,
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    textAlign: "center",
    fontSize: 64,
    color: "#0F172A",
    opacity: 0.06,
    transform: "rotate(-12deg)",
  },
  badge: {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

function resolveBranding(branding?: {
  primaryColor?: string;
  secondaryColor?: string;
}) {
  return {
    primary: branding?.primaryColor || "#111827",
    secondary: branding?.secondaryColor || "#6B7280",
  };
}

function getInvoiceStatusBadge(status?: InvoiceData["status"]) {
  if (!status) return null;
  switch (status) {
    case "created":
      return { label: "Creada", color: "#0EA5E9" };
    case "sent":
      return { label: "Enviada", color: "#F59E0B" };
    case "waiting":
      return { label: "Esperando pago", color: "#F97316" };
    case "paid":
      return { label: "Pagada", color: "#22C55E" };
    default:
      return null;
  }
}

function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function InvoicePdf({
  data,
  showBranding = true,
  watermark = false,
}: {
  data: InvoiceData;
  showBranding?: boolean;
  watermark?: boolean;
}) {
  const colors = resolveBranding(data.branding);
  const statusBadge = getInvoiceStatusBadge(data.status);
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {watermark && <Text style={styles.watermark}>QuickDocs</Text>}
        <View style={styles.row}>
          <View style={[styles.column, { flex: 1 }]}>
            {data.issuer.logoUrl ? (
              <Image
                src={data.issuer.logoUrl}
                style={{ width: 90, height: 36, marginBottom: 8 }}
              />
            ) : null}
            <Text style={{ fontSize: 14, fontWeight: 700 }}>
              {data.issuer.name}
            </Text>
            <Text>{data.issuer.email}</Text>
            <Text>{data.issuer.phone}</Text>
            <Text>{data.issuer.address}</Text>
          </View>
          <View style={[styles.column, { alignItems: "flex-end" }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Factura
            </Text>
            {statusBadge && (
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: statusBadge.color, marginTop: 6 },
                ]}
              >
                {statusBadge.label}
              </Text>
            )}
            <Text>Nº {data.invoice.number}</Text>
            <Text>
              Emisión:{" "}
              <Text style={[styles.muted, { color: colors.secondary }]}>
                {data.invoice.issueDate}
              </Text>
            </Text>
            <Text>
              Vence:{" "}
              <Text style={[styles.muted, { color: colors.secondary }]}>
                {data.invoice.dueDate}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Cliente
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>
            {data.client.name}
          </Text>
          {data.client.email && (
            <Text style={[styles.muted, { color: colors.secondary }]}>
              {data.client.email}
            </Text>
          )}
          {data.client.phone && (
            <Text style={[styles.muted, { color: colors.secondary }]}>
              {data.client.phone}
            </Text>
          )}
          {data.client.address && (
            <Text style={[styles.muted, { color: colors.secondary }]}>
              {data.client.address}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={[styles.table, { borderColor: colors.primary }]}>
            <View
              style={[
                styles.tableRow,
                styles.tableHeader,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.tableCell, { color: "#FFFFFF" }]}>
                Descripción
              </Text>
              <Text style={[styles.tableCellSmall, { color: "#FFFFFF" }]}>
                Cant.
              </Text>
              <Text style={[styles.tableCellMedium, { color: "#FFFFFF" }]}>
                Precio
              </Text>
              <Text style={[styles.tableCellMedium, { color: "#FFFFFF" }]}>
                Subtotal
              </Text>
            </View>
            {data.items.map((item, index) => (
              <View
                key={`${item.description}-${index}`}
                style={[styles.tableRow, { borderBottomColor: colors.secondary }]}
              >
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCellSmall}>{item.quantity}</Text>
                <Text style={styles.tableCellMedium}>
                  {formatMoney(item.unitPrice, data.total.currency)}
                </Text>
                <Text style={styles.tableCellMedium}>
                  {formatMoney(item.subtotal, data.total.currency)}
                </Text>
              </View>
            ))}
          </View>
          <View style={[styles.totalsBox, { borderColor: colors.primary }]}>
            <View style={styles.row}>
              <Text style={[styles.muted, { color: colors.secondary }]}>
                Subtotal
              </Text>
              <Text>
                {formatMoney(
                  data.items.reduce((sum, item) => sum + item.subtotal, 0),
                  data.total.currency
                )}
              </Text>
            </View>
            {data.tax?.percent ? (
              <View style={styles.row}>
                <Text style={[styles.muted, { color: colors.secondary }]}>
                  Impuesto ({data.tax.percent}%)
                </Text>
                <Text>
                  {formatMoney(
                    data.tax.amount || 0,
                    data.total.currency
                  )}
                </Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text style={{ fontWeight: 700 }}>Total</Text>
              <Text style={{ fontWeight: 700 }}>
                {formatMoney(data.total.amount, data.total.currency)}
              </Text>
            </View>
          </View>
        </View>

        {data.note && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.secondary }]}>Nota</Text>
            <Text>{data.note}</Text>
          </View>
        )}

        {data.policy && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              Política de servicios
            </Text>
            <Text>{data.policy}</Text>
          </View>
        )}

        {showBranding && <Text style={styles.footer}>QuickDocs</Text>}
      </Page>
    </Document>
  );
}

export function ProposalPdf({
  data,
  showBranding = true,
  watermark = false,
}: {
  data: ProposalData;
  showBranding?: boolean;
  watermark?: boolean;
}) {
  const colors = resolveBranding(data.branding);
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {watermark && <Text style={styles.watermark}>QuickDocs</Text>}
        <View style={styles.row}>
          <View style={[styles.column, { flex: 1 }]}>
            {data.provider.logoUrl ? (
              <Image
                src={data.provider.logoUrl}
                style={{ width: 90, height: 36, marginBottom: 8 }}
              />
            ) : null}
            <Text style={{ fontSize: 14, fontWeight: 700 }}>
              {data.provider.name}
            </Text>
            <Text>{data.provider.email}</Text>
            <Text>{data.provider.phone}</Text>
          </View>
          <View style={[styles.column, { alignItems: "flex-end" }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Propuesta
            </Text>
            <Text style={[styles.muted, { color: colors.secondary }]}>
              {new Date().toISOString().slice(0, 10)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Cliente
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 600 }}>
            {data.client.name}
          </Text>
          {data.client.company && (
            <Text style={[styles.muted, { color: colors.secondary }]}>
              {data.client.company}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>
            {data.proposal.title}
          </Text>
          <Text style={{ marginTop: 6 }}>{data.proposal.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Servicios
          </Text>
          <View style={[styles.table, { borderColor: colors.primary }]}>
            <View
              style={[
                styles.tableRow,
                styles.tableHeader,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.tableCell, { color: "#FFFFFF" }]}>
                Servicio
              </Text>
              <Text style={[styles.tableCellMedium, { color: "#FFFFFF" }]}>
                Precio
              </Text>
            </View>
            {data.services.map((service, index) => (
              <View
                key={`${service.name}-${index}`}
                style={[styles.tableRow, { borderBottomColor: colors.secondary }]}
              >
                <Text style={styles.tableCell}>{service.name}</Text>
                <Text style={styles.tableCellMedium}>
                  {service.price || "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={[styles.label, { color: colors.secondary }]}>
                Total propuesto
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 700 }}>{data.total}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.label, { color: colors.secondary }]}>
                Validez
              </Text>
              <Text>{data.validityDays} días</Text>
            </View>
          </View>
        </View>

        {data.terms && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              Condiciones
            </Text>
            <Text>{data.terms}</Text>
          </View>
        )}

        {showBranding && <Text style={styles.footer}>QuickDocs</Text>}
      </Page>
    </Document>
  );
}

export function ContractPdf({
  data,
  showBranding = true,
  watermark = false,
}: {
  data: ContractData;
  showBranding?: boolean;
  watermark?: boolean;
}) {
  const colors = resolveBranding(data.branding);
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {watermark && <Text style={styles.watermark}>QuickDocs</Text>}
        <View style={styles.row}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Contrato de Servicios
          </Text>
          <Text style={[styles.badge, { backgroundColor: colors.primary }]}>
            Básico
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>Partes</Text>
          <Text>
            Proveedor:{" "}
            <Text style={{ fontWeight: 600 }}>{data.parties.providerName}</Text>
          </Text>
          <Text>
            Cliente:{" "}
            <Text style={{ fontWeight: 600 }}>{data.parties.clientName}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Servicio
          </Text>
          <Text>{data.service.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Duración
          </Text>
          <Text>Inicio: {data.duration.startDate}</Text>
          <Text>
            Fin:{" "}
            {data.duration.openEnded ? "Indefinido" : data.duration.endDate}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>Pago</Text>
          <Text>Monto: {data.payment.amount}</Text>
          <Text>
            Frecuencia:{" "}
            {data.payment.frequency === "monthly" ? "Mensual" : "Único"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Cláusulas básicas
          </Text>
          <Text>• {data.clauses.liability}</Text>
          <Text>• {data.clauses.cancellation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.secondary }]}>Firma</Text>
          <Text>Nombre: {data.signature.signerName}</Text>
          <Text>Fecha: {data.signature.date}</Text>
        </View>

        {showBranding && <Text style={styles.footer}>QuickDocs</Text>}
      </Page>
    </Document>
  );
}
