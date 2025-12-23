import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ContractPdf, InvoicePdf, ProposalPdf } from "@/quickdocs/pdf";
import type { ContractData, InvoiceData, ProposalData } from "@/quickdocs/types";

type PdfRequest =
  | {
      type: "invoice";
      data: InvoiceData;
      showBranding?: boolean;
      watermark?: boolean;
    }
  | {
      type: "proposal";
      data: ProposalData;
      showBranding?: boolean;
      watermark?: boolean;
    }
  | {
      type: "contract";
      data: ContractData;
      showBranding?: boolean;
      watermark?: boolean;
    };

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PdfRequest;
    const showBranding = payload.showBranding ?? true;
    const watermark = payload.watermark ?? false;

    let doc: JSX.Element | null = null;
    let filename = "documento.pdf";

    switch (payload.type) {
      case "invoice":
        doc = (
          <InvoicePdf
            data={payload.data}
            showBranding={showBranding}
            watermark={watermark}
          />
        );
        filename = `factura-${payload.data.invoice.number || "documento"}.pdf`;
        break;
      case "proposal":
        doc = (
          <ProposalPdf
            data={payload.data}
            showBranding={showBranding}
            watermark={watermark}
          />
        );
        filename = "propuesta.pdf";
        break;
      case "contract":
        doc = (
          <ContractPdf
            data={payload.data}
            showBranding={showBranding}
            watermark={watermark}
          />
        );
        filename = "contrato.pdf";
        break;
      default:
        return NextResponse.json({ error: "Tipo no soportado." }, { status: 400 });
    }

    const buffer = await renderToBuffer(doc);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
