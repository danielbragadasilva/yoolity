"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3,  MessageSquare, Trophy, Settings, LocateFixed, CalendarFold } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FreshChatTab } from "@/app/freshchat/page"


import { ThemeToggle } from "./Themetoggle"
import EscalasPage from "@/app/escalas/page"
import ChallengePage from "@/app/challenge/page"
import DashboardPage from "@/app/dashboard/page"


export function DashboardLayout({ }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "freshchat":
        return <FreshChatTab />;
      case "escala":
        return <EscalasPage />;
      case "challenge":
        return <ChallengePage/> ;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Yoolity</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "freshchat"} onClick={() => setActiveTab("freshchat")}>
                  <LocateFixed className="h-5 w-5" />
                  <span>Monitor FreshChat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "Controle de escala"} onClick={() => setActiveTab("escala")}>
                  <CalendarFold className="h-5 w-5" />
                  <span>Escala</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "Challenge Yoo"} onClick={() => setActiveTab("challenge")}>
                  <Trophy className="h-5 w-5" />
                  <span>Challenge Yoo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <h2 className="text-lg font-semibold">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "freshchat" && "FreshChat"}
                {activeTab === "escala" && "Controle de escala"}
                {activeTab === "challenge" && "Challenge Yoo"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
              <Button size="sm">Admin</Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{renderTab()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

