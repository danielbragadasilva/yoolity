"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/utils/supabaseClient";
import { fetchUserRole } from "@/lib/fetchUserRole";
import DashboardPagePrimary from "@/components/dashboard-provider";
import TrocasPage from "@/components/trocas-page";
import AgentesPage from "@/components/agent-page";

export default function DashboardPage() {
  const [role, setRole] = useState<
    null | "coordenador" | "supervisor" | "qualidade" | "agente"
  >(null);

  useEffect(() => {
    const loadUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = await fetchUserRole(user.id);
        setRole(role);
      }
    };

    loadUserRole();
  }, []);

  const canSeeSupervisorDashboard =
    role === "coordenador" || role === "supervisor" || role === "qualidade";
  const canSeeAgentDashboard = role !== null; // todos os roles têm acesso ao dashboard do agente
  const canSeeMarketplace = role !== null;

  const defaultTab = canSeeSupervisorDashboard ? "dash-supervisor" : "dash-agent";

  if (!role) {
    return <p className="p-4 text-muted-foreground">Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList
          className={`grid w-full ${
            canSeeSupervisorDashboard ? "grid-cols-4" : "grid-cols-2"
          }`}
        >
          {canSeeSupervisorDashboard && (
            <TabsTrigger value="dash-supervisor">
              Dashboard Supervisor
            </TabsTrigger>
          )}
          {canSeeAgentDashboard && (
            <TabsTrigger value="dash-agent">Dashboard Agentes</TabsTrigger>
          )}
          {canSeeMarketplace && (
            <TabsTrigger value="exchange-requests">
              Solicitações de Troca
            </TabsTrigger>
          )}
          {canSeeMarketplace && (
            <TabsTrigger value="agents-add">Agentes</TabsTrigger>
          )}
        </TabsList>

        {canSeeSupervisorDashboard && (
          <TabsContent value="dash-supervisor">
            <DashboardPagePrimary />
          </TabsContent>
        )}
        {canSeeAgentDashboard && (
          <TabsContent value="dash-agent">
            
          </TabsContent>
        )}
        {canSeeMarketplace && (
          <TabsContent value="exchange-requests">
            <TrocasPage />
          </TabsContent>
        )}
        {canSeeMarketplace && (
          <TabsContent value="agents-add">
            <AgentesPage />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
