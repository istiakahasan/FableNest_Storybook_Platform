"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserSettings from "./user-settings/UserSettings";
import React from "react";
import Image from "next/image";

interface PrivateLayoutWrapperProps {
  children: React.ReactNode;
}

const DashboardLayoutWrapper = ({ children }: PrivateLayoutWrapperProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-18 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 justify-between px-4 lg:px-6 xl:px-8 bg-[linear-gradient(90.05deg,#0556AB_-64.03%,#EEF6FF_135.56%)]">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="flex items-center justify-start gap-2">
              <Image
                src="/images/dashboard/Vector.png"
                alt="dashboard-log"
                width={30}
                height={30}
              />

              <h2 className="font-bold text-xl lg:text-2xl text-[#FAFAFA]">
                Face2toon
              </h2>
            </div>
          </div>
          <UserSettings />
        </header>
        <main className="overflow-hidden bg-[#f7f7fc] p-4 lg:p-6 xl:p-8 min-h-[calc(100vh-72px)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayoutWrapper;
