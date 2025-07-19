import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/admin/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthProvider } from "@/components/providers/session-provider";
import React from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider className="has-data-[variant=inset]:bg-slate-900">
        <AppSidebar />
        <SidebarInset className="bg-slate-800">
          {/* warna lebih terang dari navbar seperti home */}
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
          </header>
          <section className="p-4 pt-0 bg-slate-800">{children}</section>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
