import { generarLeccionTeorica } from "@/lib/academy";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const title =
      typeof body?.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Phishing fundamentals";
    const level =
      typeof body?.level === "string" && body.level.trim()
        ? body.level.trim()
        : "Básico";

    const lesson = await generarLeccionTeorica({
      titulo: title,
      nivel: level,
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("academy lesson error", error);
    return NextResponse.json(
      { error: "Unable to generate lesson" },
      { status: 500 }
    );
  }
}
