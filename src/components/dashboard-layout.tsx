"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3, Users, MessageSquare, Trophy, Settings } from "lucide-react"
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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("freshchat")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Support CRM</h1>
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
                  <MessageSquare className="h-5 w-5" />
                  <span>FreshChat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "agents"} onClick={() => setActiveTab("agents")}>
                  <Users className="h-5 w-5" />
                  <span>Agents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "gamification"} onClick={() => setActiveTab("gamification")}>
                  <Trophy className="h-5 w-5" />
                  <span>Gamification</span>
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
                {activeTab === "agents" && "Agents"}
                {activeTab === "gamification" && "Gamification"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
              <Button size="sm">Admin</Button>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

