"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/contexts/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-[260px] min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
