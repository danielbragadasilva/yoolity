"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import {
  BarChart3, MessageSquare, Trophy,
  CalendarFold, LogOut, LaptopMinimal,
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
import Wiki from "@/app/wiki/page";

export function DashboardLayout({}: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState<string | null>(null);

  // Fetch user role ao carregar
  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", userId)
        .single() as { data: { role: string } | null; error: Error | null };

      if (error || !data) {
        console.error("Erro ao buscar role do usuário:", error);
        router.push("/unauthorized");
        return;
      }

      setRole(data.role);
    };

    fetchRole();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "freshchat":
        return role !== "agente" ? <FreshChatTab /> : <Unauthorized />;
      case "escala":
        return role === "agente" || role === "supervisor" || role === "coordenador" ? <EscalasPage /> : <Unauthorized />;
      case "challenge":
        return <ChallengePage />;
      case "wiki":
        return <Wiki />;
      default:
        return <DashboardPage />;
    }
  };

  if (!role) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
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

              {role !== "agente" && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "freshchat"} onClick={() => setActiveTab("freshchat")}>
                    <LaptopMinimal className="h-5 w-5" />
                    <span>Monitor</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {(role === "coordenador" || role === "supervisor") && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "escala"} onClick={() => setActiveTab("escala")}>
                    <CalendarFold className="h-5 w-5" />
                    <span>Escala</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "challenge"} onClick={() => setActiveTab("challenge")}>
                  <Trophy className="h-5 w-5" />
                  <span>Challenge Yoo</span>
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
          <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <h2 className="text-lg font-semibold">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "freshchat" && "FreshChat"}
                {activeTab === "escala" && "Controle de escala"}
                {activeTab === "challenge" && "Challenge Yoo"}
                {activeTab === "wiki" && "Wiki"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Help</Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 w-full p-4 lg:p-6">{renderTab()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Unauthorized() {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold">Acesso não autorizado</h2>
      <p className="mt-2">Você não tem permissão para acessar este conteúdo.</p>
    </div>
  );
}
