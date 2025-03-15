import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupervisorDashboard } from "../../components/gamification/supervisor-dashboard"
import { AgentDashboard } from "../../components/gamification/agent-dashboard"
import { Marketplace } from "../../components/gamification/marketplace"

export default function ChallengePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">🎯 Suporte bom é suporte gamificado! Bora bater metas e farmar SupCoins ?</h1>

      <Tabs defaultValue="supervisor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supervisor"> Dashboard Supervisor</TabsTrigger>
          <TabsTrigger value="agent">Dashboard Agentes</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
        <TabsContent value="supervisor">
          <SupervisorDashboard />
        </TabsContent>
        <TabsContent value="agent">
          <AgentDashboard />
        </TabsContent>
        <TabsContent value="marketplace">
          <Marketplace />
        </TabsContent>
      </Tabs>
    </div>
  )
}

