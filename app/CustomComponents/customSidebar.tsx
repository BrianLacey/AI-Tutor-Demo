"use client";

import { CSSProperties, ReactNode } from "react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const CustomSidebar = ({
  children,
  chatLoading = false,
  setChatLoading = () => {},
}: {
  children: ReactNode;
  chatLoading: boolean;
  setChatLoading: any;
}) => {
  return (
    <SidebarProvider>
      <Sidebar
        style={{ "--sidebar": "oklch(70.4% 0.04 256.788)" } as CSSProperties}
        className="text-white"
      >
        <SidebarHeader className="text-center">AI Tutor Demo</SidebarHeader>
        <SidebarContent className="p-4">
          <Button disabled={chatLoading}>Chat Thread</Button>
          <Button disabled={chatLoading}>Profile Data</Button>
          <Button
            onClick={() => {
              setChatLoading((prevState: any) => !prevState);
            }}
          >
            Test Loading State
          </Button>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-slate-600 text-white">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CustomSidebar;
