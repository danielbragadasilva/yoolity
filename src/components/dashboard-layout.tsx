"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa roteamento do Next.js
import { supabase } from "@/utils/supabaseClient"; // Importa o cliente do Supabase
import { 
  BarChart3, MessageSquare, Trophy, LocateFixed, 
  CalendarFold, LogOut, 
  UsersRound,
  LaptopMinimal,
  BookOpenText
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import FreshChatTab from "@/app/freshchat/page";
import { ThemeToggle } from "./Themetoggle";
import EscalasPage from "@/app/escalas/page";

import DashboardPage from "@/app/dashboard/page";
import ChallengePage from "@/app/challenge/page";
import Users from "@/app/users/page";
import Wiki from "@/app/wiki/page";

export function DashboardLayout({}: { children: React.ReactNode }) {
  const router = useRouter(); // Inicializa o roteador do Next.js
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Faz logout no Supabase
    router.push("/login"); // Redireciona para a tela de login
  };

  const renderTab = () => {
    switch (activeTab) {
      case "freshchat":
        return <FreshChatTab />;
      case "escala":
        return <EscalasPage />;
      case "challenge":
        return <ChallengePage />;
      case "users":
        return <Users />;
        case "wiki":
          return <Wiki />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        {/* Sidebar */}
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
                  <LaptopMinimal className="h-5 w-5" />
                  <span>Monitor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "escala"} onClick={() => setActiveTab("escala")}>
                  <CalendarFold className="h-5 w-5" />
                  <span>Escala</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "challenge"} onClick={() => setActiveTab("challenge")}>
                  <Trophy className="h-5 w-5" />
                  <span>Challenge Yoo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
                  <UsersRound className="h-5 w-5" />
                  <span>Usuários</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "wiki"} onClick={() => setActiveTab("wiki")}>
                  <BookOpenText className="h-5 w-5" />
                  <span>Wiki</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Conteúdo Principal */}
        <div className="flex flex-col w-full min-h-screen">
          {/* Header */}
          <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 lg:px-6">
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
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 w-full p-4 lg:p-6">{renderTab()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
