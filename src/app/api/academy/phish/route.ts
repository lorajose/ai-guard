import { generarSimulacionPhishing } from "@/lib/academy";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const brand = typeof body?.brand === "string" ? body.brand : "IA Shield";
    const scenario =
      typeof body?.scenario === "string"
        ? body.scenario
        : "Entrenamiento mensual";

    const simulation = await generarSimulacionPhishing({
      marca: brand,
      escenario: scenario,
    });

    return NextResponse.json(simulation);
  } catch (error) {
    console.error("academy simulation error", error);
    return NextResponse.json(
      { error: "Unable to generate simulation" },
      { status: 500 }
    );
  }
}
