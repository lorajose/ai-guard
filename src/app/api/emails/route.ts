import {
  sendPasswordResetEmail,
  sendTrialExpiringEmail,
  sendWelcomeEmail,
} from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";

type EmailType = "welcome" | "password_reset" | "trial";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY no configurada." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { type, email, metadata } = body as {
      type: EmailType;
      email: string;
      metadata?: Record<string, string>;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Se requiere un email válido." },
        { status: 400 }
      );
    }

    switch (type) {
      case "welcome":
        await sendWelcomeEmail(email, metadata?.name);
        break;
      case "password_reset":
        await sendPasswordResetEmail(email);
        break;
      case "trial":
        if (!metadata?.trialEndsAt) {
          return NextResponse.json(
            { error: "metadata.trialEndsAt es obligatorio para trial." },
            { status: 400 }
          );
        }
        await sendTrialExpiringEmail(email, {
          trialEndsAt: metadata.trialEndsAt,
          planName: metadata?.planName,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de email no soportado." },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando email transaccional:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el correo." },
      { status: 500 }
    );
  }
}
