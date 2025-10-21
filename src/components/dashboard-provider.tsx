import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentesAtivos } from "@/components/agentes-ativos"
import { EscalaGrafico } from "@/components/escala-grafico"
import { TrocasPendentes } from "@/components/trocas-pendentes"
import { ResumoSemanal } from "@/components/resumo-semanal"
import { RefreshCw, ClipboardList, Calendar } from "lucide-react"
import { AgentesOn } from "./agentes-on"

export default function DashboardPagePrimary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <AgentesOn />
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trocas Pendentes</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trocas Aprovadas</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Neste mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">+5% comparado ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escala de Agentes - Hoje</CardTitle>
          <CardDescription>Visualização dos horários de trabalho dos agentes</CardDescription>
        </CardHeader>
        <CardContent>
          <EscalaGrafico />
        </CardContent>
      </Card>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">Trocas Pendentes</TabsTrigger>
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes" className="space-y-4">
          <TrocasPendentes />
        </TabsContent>
        <TabsContent value="semana" className="space-y-4">
          <ResumoSemanal />
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agentes Ativos Agora</CardTitle>
            <CardDescription>Agentes trabalhando no momento atual</CardDescription>
          </CardHeader>
          <CardContent>
            <AgentesAtivos />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Próximas Trocas</CardTitle>
            <CardDescription>Trocas aprovadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Carlos Silva → Maria Oliveira</div>
                  <div className="text-xs text-muted-foreground">Amanhã, 08:00 - 17:00</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">João Pereira → Ana Santos</div>
                  <div className="text-xs text-muted-foreground">Quinta, 09:00 - 18:00</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Luiza Costa → Pedro Alves</div>
                  <div className="text-xs text-muted-foreground">Sexta, 08:00 - 17:00</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
