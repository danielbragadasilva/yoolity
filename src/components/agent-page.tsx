"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus, Search, RefreshCw, Database, Loader2, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface Agent {
  id: string;
  nome: string;
  freshchat_id: string;
  email: string;
  horarios: {
    [key: string]: {
      inicio?: string;
      fim?: string;
      horario_inicio?: string;
      horario_fim?: string;
      intervalo_inicio: string;
      intervalo_fim: string;
    };
  };
  dias_trabalho: string[];
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const AgentesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [newAgent, setNewAgent] = useState({
    nome: "",
    email: "",
    freshchat_id: "",
    horarios: {
      Dom: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Seg: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Ter: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Qua: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Qui: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Sex: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
      Sab: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" }
    },
    dias_trabalho: [] as string[]
  })

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar agentes')
      }
      console.log('Dados recebidos:', data)
      setAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
      toast.error('Erro ao carregar agentes: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const filteredAgents = agents?.filter(agent =>
    agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddAgent = async () => {
    try {
      // Preparar dados para envio
      const agentData = {
        nome: newAgent.nome,
        email: newAgent.email,
        freshchat_id: newAgent.freshchat_id,
        dias_trabalho: newAgent.dias_trabalho,
        horarios: newAgent.horarios
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar agente')
      }

      const novoAgente = await response.json()
      setAgents(prevAgents => [...prevAgents, novoAgente])

      toast.success('Agente adicionado com sucesso!')
      setShowAddAgentDialog(false)
      setNewAgent({
        nome: "",
        email: "",
        freshchat_id: "",
        horarios: {
          Dom: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Seg: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Ter: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Qua: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Qui: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Sex: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" },
          Sab: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" }
        },
        dias_trabalho: []
      })
    } catch (error) {
      console.error('Erro ao adicionar agente:', error)
      toast.error('Erro ao adicionar agente: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  const handleEditAgent = async () => {
    if (!editingAgent) return

    try {
      const response = await fetch(`/api/agents/${editingAgent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAgent),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar agente')
      }

      await fetchAgents()
      setShowEditDialog(false)
      setEditingAgent(null)
      toast.success('Agente atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar agente:', error)
      toast.error('Erro ao atualizar agente: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }



  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agentes</h2>
          <p className="text-muted-foreground">
            Gerencie os agentes e suas configurações
          </p>
        </div>
        <Button onClick={() => setShowAddAgentDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Agente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Agente</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">Nome</Label>
              <Input
                id="nome"
                className="col-span-3"
                value={newAgent.nome || ''}
                onChange={(e) => setNewAgent({ ...newAgent, nome: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="freshchat_id" className="text-right">Freshchat ID</Label>
              <Input
                id="freshchat_id"
                className="col-span-3"
                value={newAgent.freshchat_id || ''}
                onChange={(e) => setNewAgent({ ...newAgent, freshchat_id: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">E-mail</Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={newAgent.email || ''}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Escala de Trabalho</Label>
              <div className="grid gap-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                  <div key={dia} className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-4">
                    <div className="md:col-span-2">
                      <Button
                        variant={newAgent.dias_trabalho?.includes(dia) ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const dias = newAgent.dias_trabalho || []
                          const newDias = dias.includes(dia)
                            ? dias.filter(d => d !== dia)
                            : [...dias, dia]
                          setNewAgent({ ...newAgent, dias_trabalho: newDias })
                        }}
                      >
                        {dia}
                      </Button>
                    </div>
                    {newAgent.dias_trabalho?.includes(dia) ? (
                      <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Horário de Trabalho</Label>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Input
                              type="time"
                              value={newAgent.horarios[dia].inicio}
                              onChange={(e) => setNewAgent({
                                ...newAgent,
                                horarios: {
                                  ...newAgent.horarios,
                                  [dia]: { ...newAgent.horarios[dia], inicio: e.target.value }
                                }
                              })}
                              className="w-full sm:w-auto"
                            />
                            <span className="hidden sm:block">até</span>
                            <Input
                              type="time"
                              value={newAgent.horarios[dia].fim}
                              onChange={(e) => setNewAgent({
                                ...newAgent,
                                horarios: {
                                  ...newAgent.horarios,
                                  [dia]: { ...newAgent.horarios[dia], fim: e.target.value }
                                }
                              })}
                              className="w-full sm:w-auto"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Intervalo</Label>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Input
                              type="time"
                              value={newAgent.horarios[dia].intervalo_inicio}
                              onChange={(e) => setNewAgent({
                                ...newAgent,
                                horarios: {
                                  ...newAgent.horarios,
                                  [dia]: { ...newAgent.horarios[dia], intervalo_inicio: e.target.value }
                                }
                              })}
                              className="w-full sm:w-auto"
                            />
                            <span className="hidden sm:block">até</span>
                            <Input
                              type="time"
                              value={newAgent.horarios[dia].intervalo_fim}
                              onChange={(e) => setNewAgent({
                                ...newAgent,
                                horarios: {
                                  ...newAgent.horarios,
                                  [dia]: { ...newAgent.horarios[dia], intervalo_fim: e.target.value }
                                }
                              })}
                              className="w-full sm:w-auto"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="md:col-span-10 text-muted-foreground text-sm italic">
                        Dia de folga
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAgentDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddAgent}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
          </DialogHeader>
          {editingAgent && (
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={editingAgent.nome}
                    onChange={(e) => setEditingAgent({ ...editingAgent, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingAgent.email}
                    onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="freshchat_id">ID do Freshchat</Label>
                  <Input
                    id="freshchat_id"
                    value={editingAgent.freshchat_id}
                    onChange={(e) => setEditingAgent({ ...editingAgent, freshchat_id: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatar">URL do Avatar</Label>
                  <Input
                    id="avatar"
                    value={editingAgent.avatar}
                    onChange={(e) => setEditingAgent({ ...editingAgent, avatar: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Dias de Trabalho</Label>
                <div className="flex flex-wrap gap-2">
                  {diasDaSemana.map((dia) => (
                    <div key={dia} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dia-${dia}`}
                        checked={editingAgent.dias_trabalho?.includes(dia)}
                        onCheckedChange={(checked) => {
                          const dias = checked
                            ? [...(editingAgent.dias_trabalho || []), dia]
                            : editingAgent.dias_trabalho?.filter((d) => d !== dia) || []
                          setEditingAgent({
                            ...editingAgent,
                            dias_trabalho: dias,
                            horarios: checked
                              ? {
                                  ...editingAgent.horarios,
                                  [dia]: { horario_inicio: "", horario_fim: "", intervalo_inicio: "", intervalo_fim: "" }
                                }
                              : Object.fromEntries(
                                  Object.entries(editingAgent.horarios || {}).filter(([key]) => key !== dia)
                                )
                          })
                        }}
                      />
                      <Label htmlFor={`dia-${dia}`}>{dia}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label>Horários</Label>
                <div className="grid gap-4">
                  {(editingAgent.dias_trabalho || []).map((dia) => (
                    <div key={dia} className="grid md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-2 flex items-center h-10">
                        <span className="font-medium">{dia}</span>
                      </div>
                      {editingAgent.horarios[dia] ? (
                        <div className="md:col-span-10 grid gap-4">
                          <div className="space-y-2">
                            <Label>Horário de Trabalho</Label>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                              <Input
                                type="time"
                                value={editingAgent.horarios[dia].horario_inicio || editingAgent.horarios[dia].inicio}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  horarios: {
                                    ...editingAgent.horarios,
                                    [dia]: { ...editingAgent.horarios[dia], horario_inicio: e.target.value }
                                  }
                                })}
                                className="w-full sm:w-auto"
                              />
                              <span className="hidden sm:block">até</span>
                              <Input
                                type="time"
                                value={editingAgent.horarios[dia].horario_fim || editingAgent.horarios[dia].fim}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  horarios: {
                                    ...editingAgent.horarios,
                                    [dia]: { ...editingAgent.horarios[dia], horario_fim: e.target.value }
                                  }
                                })}
                                className="w-full sm:w-auto"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Intervalo</Label>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                              <Input
                                type="time"
                                value={editingAgent.horarios[dia].intervalo_inicio}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  horarios: {
                                    ...editingAgent.horarios,
                                    [dia]: { ...editingAgent.horarios[dia], intervalo_inicio: e.target.value }
                                  }
                                })}
                                className="w-full sm:w-auto"
                              />
                              <span className="hidden sm:block">até</span>
                              <Input
                                type="time"
                                value={editingAgent.horarios[dia].intervalo_fim}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  horarios: {
                                    ...editingAgent.horarios,
                                    [dia]: { ...editingAgent.horarios[dia], intervalo_fim: e.target.value }
                                  }
                                })}
                                className="w-full sm:w-auto"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="md:col-span-10 text-muted-foreground text-sm italic">
                          Dia de folga
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
            <Button onClick={handleEditAgent}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agente</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAgent.avatar || "/placeholder.svg"} alt={selectedAgent.nome} />
                  <AvatarFallback>{selectedAgent.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedAgent.nome}</h3>
                  <p className="text-muted-foreground">{selectedAgent.email}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedAgent.freshchat_id}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Escala de Trabalho</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedAgent.dias_trabalho || []).map((dia) => {
                    const horario = selectedAgent.horarios[dia]
                    return (
                      <div key={dia} className="border rounded-lg p-4 space-y-3">
                        <div className="text-lg font-medium text-primary">{dia}</div>
                        {horario ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Horário de Trabalho:</span>
                              <span className="font-medium">
                                {horario.horario_inicio || horario.inicio || '--:--'} - {horario.horario_fim || horario.fim || '--:--'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Intervalo:</span>
                              <span>
                                {horario.intervalo_inicio || '--:--'} - {horario.intervalo_fim || '--:--'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">Horários não definidos</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum agente encontrado</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Não há agentes cadastrados no sistema.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="transition-all duration-200 ease-in-out hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.nome} />
                      <AvatarFallback>{agent.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{agent.nome}</CardTitle>
                      <CardDescription>{agent.email}</CardDescription>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="cursor-help">
                          <Info className="h-3 w-3" />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ID: {agent.freshchat_id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Horários:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {(agent.dias_trabalho || []).map((dia) => (
                        <div key={dia} className="text-sm border rounded p-2">
                          <div className="font-medium text-primary">{dia}</div>
                          {agent.horarios[dia] ? (
                            <>
                              <div className="mt-1">
                                <span className="text-muted-foreground">Trabalho:</span>{' '}
                                {agent.horarios[dia].horario_inicio || agent.horarios[dia].inicio || '--:--'} - {agent.horarios[dia].horario_fim || agent.horarios[dia].fim || '--:--'}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <span>Intervalo:</span>{' '}
                                {agent.horarios[dia].intervalo_inicio || '--:--'} - {agent.horarios[dia].intervalo_fim || '--:--'}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-muted-foreground mt-1">Horários não definidos</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedAgent(agent)
                    setShowDetailsDialog(true)
                  }}
                >
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm"
                   onClick={() => {
                     // Prepara os dados do agente para edição
                     const agentForEdit = {
                       ...agent,
                       horarios: agent.horarios || {},
                       dias_trabalho: agent.dias_trabalho || []
                     }
                     setEditingAgent(agentForEdit)
                     setShowEditDialog(true)
                   }}
                 >
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default AgentesPage
