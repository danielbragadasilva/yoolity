"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabaseClient"
import { fetchUserRole } from "@/lib/fetchUserRole"
import DashboardPagePrimary from "@/components/dashboard-provider"

export default function DashboardPage() {
  const [role, setRole] = useState<null | "coordenador" | "supervisor" | "qualidade" | "agente">(null)

  useEffect(() => {
    const loadUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const role = await fetchUserRole(user.id)
        setRole(role)
      }
    }

    loadUserRole()
  }, [])

  const canSeeSupervisorDashboard = role === "coordenador" || role === "supervisor" || role === "qualidade"
  const canSeeAgentDashboard = role !== null // todos os roles têm acesso ao dashboard do agente
  const canSeeMarketplace = role !== null

  const defaultTab = canSeeSupervisorDashboard ? "supervisor" : "agent"

  if (!role) {
    return <p className="p-4 text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className={`grid w-full ${canSeeSupervisorDashboard ? "grid-cols-3" : "grid-cols-2"}`}>
          {canSeeSupervisorDashboard && (
            <TabsTrigger value="supervisor">Dashboard</TabsTrigger>
          )}
          {canSeeAgentDashboard && (
            <TabsTrigger value="agent">Dashboard Agentes</TabsTrigger>
          )}
          {canSeeMarketplace && (
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          )}
        </TabsList>

        {canSeeSupervisorDashboard && (
          <TabsContent value="supervisor">
            <DashboardPagePrimary />
          </TabsContent>
        )}
        {canSeeAgentDashboard && (
          <TabsContent value="agent">
            {/* <AgentDashboard /> */}
          </TabsContent>
        )}
        {canSeeMarketplace && (
          <TabsContent value="marketplace">
            {/* <Marketplace /> */}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
