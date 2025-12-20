"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-cyberBlue to-black text-white">
      <div className="flex flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
