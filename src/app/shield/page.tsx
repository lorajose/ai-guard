// src/app/dashboard/shield/page.tsx
"use client";
import { useState } from "react";

export default function ShieldPage() {
  const [text, setText] = useState("");
  const [res, setRes] = useState<any>(null);

  const submit = async () => {
    const r = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const j = await r.json();
    setRes(j);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-3">Verificar mensaje / email</h2>
      <textarea
        className="w-full border rounded p-2"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn mt-3" onClick={submit}>
        Analizar
      </button>

      {res && (
        <div className="mt-6 border rounded p-4">
          <p>
            <b>Label:</b> {res.label}
          </p>
          <p>
            <b>Score:</b> {res.score}
          </p>
          <p>
            <b>Consejo:</b> {res.consejo}
          </p>
        </div>
      )}
    </div>
  );
}
