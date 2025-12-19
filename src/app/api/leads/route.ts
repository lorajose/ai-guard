import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !serviceRole) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE."
    );
  }

  return createSupabaseClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin.from("leads").insert({
      name: payload.name?.trim() || null,
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      source: payload.source || "web",
      notes: payload.notes || null,
      metadata: payload.metadata || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
