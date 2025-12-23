"use client";

import { VoiceflowChat } from "@/components/VoiceflowChat";
import { DashboardShell } from "@/components/DashboardShell";

export default function DashboardChatPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Dashboard · Chat IA
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Chat IA
          </h1>
          <p className="text-sm text-zinc-400">
            Conversa con el asistente y guarda leads automáticamente.
          </p>
        </header>
        <VoiceflowChat />
      </div>
    </DashboardShell>
  );
}
