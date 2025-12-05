"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0F172A",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          borderRadius: "16px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#39FF14",
            secondary: "#0F172A",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0F172A",
          },
        },
      }}
    />
  );
}
