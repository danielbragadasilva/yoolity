"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Search,
  Database,
  Loader2,
  Info,
  Clock,
  Calendar,
  Users,
  Coffee,
} from "lucide-react";

import { toast } from "sonner";

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

// Ordem correta dos dias da semana (começando com Segunda e terminando com Domingo)
const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const AgentesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({
    nome: "",
    email: "",
    freshchat_id: "",
    horarios: {
      Dom: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Seg: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Ter: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Qua: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Qui: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Sex: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
      Sab: {
        horario_inicio: "",
        horario_fim: "",
        intervalo_inicio: "",
        intervalo_fim: "",
      },
    },
    dias_trabalho: [] as string[],
  });

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agents");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar agentes");
      }
      console.log("Dados recebidos:", data);
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
      toast.error(
        "Erro ao carregar agentes: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents?.filter(
    (agent) =>
      agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAgent = async () => {
    try {
      // Preparar dados para envio
      const agentData = {
        nome: newAgent.nome,
        email: newAgent.email,
        freshchat_id: newAgent.freshchat_id,
        dias_trabalho: newAgent.dias_trabalho,
        horarios: newAgent.horarios,
      };

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar agente");
      }

      const novoAgente = await response.json();
      setAgents((prevAgents) => [...prevAgents, novoAgente]);

      toast.success("Agente adicionado com sucesso!");
      setShowAddAgentDialog(false);
      setNewAgent({
        nome: "",
        email: "",
        freshchat_id: "",
        horarios: {
          Dom: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Seg: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Ter: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Qua: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Qui: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Sex: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
          Sab: {
            horario_inicio: "",
            horario_fim: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
        },
        dias_trabalho: [],
      });
    } catch (error) {
      console.error("Erro ao adicionar agente:", error);
      toast.error(
        "Erro ao adicionar agente: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
    }
  };

  const handleEditAgent = async () => {
    if (!editingAgent) return;

    try {
      const response = await fetch(`/api/agents/${editingAgent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingAgent),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar agente");
      }

      await fetchAgents();
      setShowEditDialog(false);
      setEditingAgent(null);
      toast.success("Agente atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar agente:", error);
      toast.error(
        "Erro ao atualizar agente: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
    }
  };

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
          <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Agente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="nome"
                  className="col-span-3"
                  value={newAgent.nome || ""}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, nome: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="freshchat_id" className="text-right">
                  Freshchat ID
                </Label>
                <Input
                  id="freshchat_id"
                  className="col-span-3"
                  value={newAgent.freshchat_id || ""}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, freshchat_id: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={newAgent.email || ""}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold">
                  Escala de Trabalho
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (dia) => (
                      <div key={dia} className="flex-shrink-0">
                        <Button
                          variant={
                            newAgent.dias_trabalho?.includes(dia)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full min-w-[60px]"
                          onClick={() => {
                            const dias = newAgent.dias_trabalho || [];
                            const newDias = dias.includes(dia)
                              ? dias.filter((d) => d !== dia)
                              : [...dias, dia];
                            setNewAgent({
                              ...newAgent,
                              dias_trabalho: newDias,
                            });
                          }}
                        >
                          {dia}
                        </Button>
                      </div>
                    )
                  )}
                </div>

                {/* Horários para os dias selecionados */}
                {(newAgent.dias_trabalho || []).length > 0 && (
                  <div className="space-y-4 mt-4">
                    <Label className="font-medium">Configurar Horários</Label>
                    <div className="grid gap-4">
                      {(newAgent.dias_trabalho || []).map((dia) => (
                        <div
                          key={dia}
                          className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-4 p-3 border rounded-md"
                        >
                          <div className="md:col-span-2">
                            <div className="font-medium">{dia}</div>
                          </div>
                          <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Horário de Trabalho</Label>
                              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <Input
                                  type="time"
                                  value={newAgent.horarios[dia]?.horario_inicio || newAgent.horarios[dia]?.inicio || ""}
                                  onChange={(e) => {
                                    const updatedHorarios = {
                                      ...newAgent.horarios,
                                      [dia]: {
                                        ...newAgent.horarios[dia],
                                        horario_inicio: e.target.value,
                                      },
                                    };
                                    // Remove o campo antigo se existir
                                    if (updatedHorarios[dia].inicio) {
                                      delete updatedHorarios[dia].inicio;
                                    }
                                    setNewAgent({
                                      ...newAgent,
                                      horarios: updatedHorarios,
                                    });
                                  }}
                                  className="w-full sm:w-auto"
                                />
                                <span className="hidden sm:block">até</span>
                                <Input
                                  type="time"
                                  value={newAgent.horarios[dia].horario_fim || newAgent.horarios[dia].fim || ""}
                                  onChange={(e) => {
                                    const updatedHorarios = {
                                      ...newAgent.horarios,
                                      [dia]: {
                                        ...newAgent.horarios[dia],
                                        horario_fim: e.target.value,
                                      },
                                    };
                                    // Remove o campo antigo se existir
                                    if (updatedHorarios[dia].fim) {
                                      delete updatedHorarios[dia].fim;
                                    }
                                    setNewAgent({
                                      ...newAgent,
                                      horarios: updatedHorarios,
                                    });
                                  }}
                                  className="w-full sm:w-auto"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Intervalo</Label>
                              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <Input
                                  type="time"
                                  value={
                                    newAgent.horarios[dia].intervalo_inicio
                                  }
                                  onChange={(e) =>
                                    setNewAgent({
                                      ...newAgent,
                                      horarios: {
                                        ...newAgent.horarios,
                                        [dia]: {
                                          ...newAgent.horarios[dia],
                                          intervalo_inicio: e.target.value,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full sm:w-auto"
                                />
                                <span className="hidden sm:block">até</span>
                                <Input
                                  type="time"
                                  value={newAgent.horarios[dia].intervalo_fim}
                                  onChange={(e) =>
                                    setNewAgent({
                                      ...newAgent,
                                      horarios: {
                                        ...newAgent.horarios,
                                        [dia]: {
                                          ...newAgent.horarios[dia],
                                          intervalo_fim: e.target.value,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full sm:w-auto"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddAgentDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddAgent}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full">
            <DialogHeader>
              <DialogTitle>Editar Agente</DialogTitle>
            </DialogHeader>
            {editingAgent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    className="col-span-3"
                    value={editingAgent.nome || ""}
                    onChange={(e) =>
                      setEditingAgent({ ...editingAgent, nome: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="freshchat_id" className="text-right">
                    Freshchat ID
                  </Label>
                  <Input
                    id="freshchat_id"
                    className="col-span-3"
                    value={editingAgent.freshchat_id || ""}
                    onChange={(e) =>
                      setEditingAgent({ ...editingAgent, freshchat_id: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    value={editingAgent.email || ""}
                    onChange={(e) =>
                      setEditingAgent({ ...editingAgent, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    URL do Avatar
                  </Label>
                  <Input
                    id="avatar"
                    className="col-span-3"
                    value={editingAgent.avatar || ""}
                    onChange={(e) =>
                      setEditingAgent({ ...editingAgent, avatar: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    Escala de Trabalho
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {diasDaSemana.map((dia) => (
                      <div key={dia} className="flex-shrink-0">
                        <Button
                          variant={
                            editingAgent.dias_trabalho?.includes(dia)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full min-w-[60px]"
                          onClick={() => {
                            const dias = editingAgent.dias_trabalho || [];
                            const newDias = dias.includes(dia)
                              ? dias.filter((d) => d !== dia)
                              : [...dias, dia];
                            setEditingAgent({
                              ...editingAgent,
                              dias_trabalho: newDias,
                              horarios: dias.includes(dia)
                                ? Object.fromEntries(
                                    Object.entries(editingAgent.horarios || {}).filter(
                                      ([key]) => key !== dia
                                    )
                                  )
                                : {
                                    ...editingAgent.horarios,
                                    [dia]: {
                                      horario_inicio: "",
                                      horario_fim: "",
                                      intervalo_inicio: "",
                                      intervalo_fim: "",
                                    },
                                  },
                            });
                          }}
                        >
                          {dia}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Horários para os dias selecionados */}
                  {(editingAgent.dias_trabalho || []).length > 0 && (
                    <div className="space-y-4 mt-4">
                      <Label className="font-medium">Configurar Horários</Label>
                      <div className="grid gap-4">
                        {(editingAgent.dias_trabalho || []).map((dia) => (
                          <div
                            key={dia}
                            className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-4 p-3 border rounded-md"
                          >
                            <div className="md:col-span-2">
                              <div className="font-medium">{dia}</div>
                            </div>
                            <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Horário de Trabalho</Label>
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                  <Input
                                    type="time"
                                    value={
                                      editingAgent.horarios[dia]?.horario_inicio ||
                                      editingAgent.horarios[dia]?.inicio ||
                                      ""
                                    }
                                    onChange={(e) => {
                                      const updatedHorarios = {
                                        ...editingAgent.horarios,
                                        [dia]: {
                                          ...editingAgent.horarios[dia],
                                          horario_inicio: e.target.value,
                                        },
                                      };
                                      // Remove o campo antigo se existir
                                      if (updatedHorarios[dia].inicio) {
                                        delete updatedHorarios[dia].inicio;
                                      }
                                      setEditingAgent({
                                        ...editingAgent,
                                        horarios: updatedHorarios,
                                      });
                                    }}
                                    className="w-full sm:w-auto"
                                  />
                                  <span className="hidden sm:block">até</span>
                                  <Input
                                    type="time"
                                    value={
                                      editingAgent.horarios[dia]?.horario_fim ||
                                      editingAgent.horarios[dia]?.fim ||
                                      ""
                                    }
                                    onChange={(e) => {
                                      const updatedHorarios = {
                                        ...editingAgent.horarios,
                                        [dia]: {
                                          ...editingAgent.horarios[dia],
                                          horario_fim: e.target.value,
                                        },
                                      };
                                      // Remove o campo antigo se existir
                                      if (updatedHorarios[dia].fim) {
                                        delete updatedHorarios[dia].fim;
                                      }
                                      setEditingAgent({
                                        ...editingAgent,
                                        horarios: updatedHorarios,
                                      });
                                    }}
                                    className="w-full sm:w-auto"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Intervalo</Label>
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                  <Input
                                    type="time"
                                    value={
                                      editingAgent.horarios[dia]?.intervalo_inicio ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setEditingAgent({
                                        ...editingAgent,
                                        horarios: {
                                          ...editingAgent.horarios,
                                          [dia]: {
                                            ...editingAgent.horarios[dia],
                                            intervalo_inicio: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full sm:w-auto"
                                  />
                                  <span className="hidden sm:block">até</span>
                                  <Input
                                    type="time"
                                    value={
                                      editingAgent.horarios[dia]?.intervalo_fim ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setEditingAgent({
                                        ...editingAgent,
                                        horarios: {
                                          ...editingAgent.horarios,
                                          [dia]: {
                                            ...editingAgent.horarios[dia],
                                            intervalo_fim: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className="w-full sm:w-auto"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleEditAgent}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-[90vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Detalhes do Agente</DialogTitle>
            </DialogHeader>
            {selectedAgent && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/20 p-3 sm:p-4 rounded-lg">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage
                      src={selectedAgent.avatar || "/placeholder.svg"}
                      alt={selectedAgent.nome}
                    />
                    <AvatarFallback>
                      {selectedAgent.nome.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 w-full">
                    <h3 className="text-xl font-semibold text-primary">
                      {selectedAgent.nome}
                    </h3>
                    <p className="text-muted-foreground break-all text-sm">
                      {selectedAgent.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        ID: {selectedAgent.freshchat_id}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h4 className="text-lg font-semibold">
                      Escala de Trabalho
                    </h4>
                  </div>

                  {/* Resumo da escala */}
                  <div className="bg-muted/30 rounded-lg p-3 sm:p-4 border border-muted">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="font-medium">
                          {(selectedAgent.dias_trabalho || []).length} dias de
                          trabalho
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full">
                        <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-green-600 font-medium">
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grade de horários */}
                  <div className="flex flex-nowrap overflow-x-auto gap-2 w-full pb-2">
                    {diasDaSemana.map((dia) => {
                      const horario = selectedAgent.horarios[dia];
                      const isWorkDay = (
                        selectedAgent.dias_trabalho || []
                      ).includes(dia);

                      // Verificar se há horários cadastrados para este dia
                      const hasSchedule =
                        isWorkDay &&
                        horario &&
                        (horario.horario_inicio ||
                          horario.inicio ||
                          horario.horario_fim ||
                          horario.fim);

                      // Verificar se há intervalo cadastrado
                      const hasInterval =
                        hasSchedule &&
                        horario &&
                        horario.intervalo_inicio &&
                        horario.intervalo_fim;

                      // Formatar horários para exibição
                      const formatTime = (time) => {
                        if (!time) return "--:--";

                        // Se for um timestamp numérico (ex: 1752994800000)
                        if (typeof time === "number" || /^\d+$/.test(time)) {
                          try {
                            // Criar data a partir do timestamp
                            const date = new Date(Number(time));
                            // Usar getUTCHours e getUTCMinutes para obter o horário em UTC
                            const hours = date.getUTCHours();
                            const minutes = date.getUTCMinutes();
                            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                          } catch (e) {
                            console.error("Erro ao converter timestamp:", e);
                            return "--:--";
                          }
                        }

                        // Garantir formato HH:MM se já for string
                        if (typeof time === "string") {
                          if (time.length === 5 && time.includes(":"))
                            return time;
                          // Tentar converter outros formatos de string
                          try {
                            const [hours, minutes] = time
                              .split(":")
                              .map(Number);
                            return `${hours
                              .toString()
                              .padStart(2, "0")}:${minutes
                              .toString()
                              .padStart(2, "0")}`;
                          } catch {
                            // Ignorar erro e continuar
                            return "--:--";
                          }
                        }

                        // Fallback para casos não tratados
                        return "--:--";
                      };

                      // Calcular duração do expediente
                      const calculateDuration = () => {
                        const inicio =
                          horario?.horario_inicio || horario?.inicio;
                        const fim = horario?.horario_fim || horario?.fim;
                        if (inicio && fim) {
                          try {
                            // Converter para minutos do dia, independente do formato
                            const getMinutesFromTime = (time) => {
                              // Se for timestamp numérico
                              if (
                                typeof time === "number" ||
                                /^\d+$/.test(time)
                              ) {
                                const date = new Date(Number(time));
                                return date.getUTCHours() * 60 + date.getUTCMinutes();
                              }
                              // Se for string no formato HH:MM
                              if (
                                typeof time === "string" &&
                                time.includes(":")
                              ) {
                                const [hours, minutes] = time
                                  .split(":")
                                  .map(Number);
                                return hours * 60 + minutes;
                              }
                              return 0;
                            };

                            const minutosInicio = getMinutesFromTime(inicio);
                            const minutosFim = getMinutesFromTime(fim);
                            const totalMinutos = minutosFim - minutosInicio;

                            if (totalMinutos <= 0) return "--"; // Caso de horário inválido
                            const horas = Math.floor(totalMinutos / 60);
                            const minutos = totalMinutos % 60;
                            return `${horas}h${
                              minutos > 0 ? ` ${minutos}m` : ""
                            }`;
                          } catch (e) {
                            console.error("Erro ao calcular duração:", e);
                            return "--";
                          }
                        }
                        return "--";
                      };

                      return (
                        <div
                          key={dia}
                          className={`relative border-2 rounded-xl p-2 transition-all duration-200 flex-shrink-0 flex-grow-0 min-w-[120px] max-w-[150px] ${
                            hasSchedule
                              ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:shadow-md"
                              : "border-muted bg-muted/30"
                          }`}
                        >
                          {/* Indicador de status */}
                          <div
                            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                              hasSchedule ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />

                          {/* Dia da semana */}
                          <div
                            className={`text-sm font-semibold mb-2 ${
                              hasSchedule
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {dia}
                          </div>

                          {hasSchedule ? (
                            <div className="space-y-3">
                              {/* Escala de trabalho no formato solicitado */}
                              <div className="space-y-3">
                                <div className="bg-white/80 rounded-lg p-2 border w-full overflow-hidden">
                                  <div className="space-y-1 w-full">
                                    {/* Início da escala */}
                                    <div className="flex items-center justify-between gap-1 mb-1 w-full">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                          Início:
                                        </span>
                                      </div>
                                      <div className="font-medium text-primary whitespace-nowrap text-xs flex-shrink-0">
                                        {formatTime(
                                          horario.horario_inicio ||
                                            horario.inicio
                                        )}
                                      </div>
                                    </div>

                                    {/* Intervalo - só exibe se tiver dados */}
                                    {hasInterval && (
                                      <div className="flex items-center justify-between gap-1 py-1 border-y border-muted/50 w-full">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                          <Coffee className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {" "}
                                            Pausa:
                                          </span>
                                        </div>
                                        <div className="font-medium text-orange-700 text-right overflow-hidden text-xs flex-shrink-0">
                                          <span className="whitespace-nowrap inline-block max-w-[90px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-full truncate">
                                            {formatTime(
                                              horario.intervalo_inicio
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {hasInterval && (
                                      <div className="flex items-center justify-between gap-1 py-1 border-y border-muted/50 w-full">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                          <Coffee className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {" "}
                                            Pausa:
                                          </span>
                                        </div>
                                        <div className="font-medium text-orange-700 text-right overflow-hidden text-xs flex-shrink-0">
                                          <span className="whitespace-nowrap inline-block max-w-[90px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-full truncate">
                                            
                                            {formatTime(horario.intervalo_fim)}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Término da escala */}
                                    <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-muted/50 w-full">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                          Término:
                                        </span>
                                      </div>
                                      <div className="font-medium text-primary whitespace-nowrap text-xs flex-shrink-0">
                                        {formatTime(
                                          horario.horario_fim || horario.fim
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Duração total */}
                              <div className="pt-1 border-t border-muted">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Duração:
                                  </span>
                                  <span className="font-semibold text-primary">
                                    {calculateDuration()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2 text-center bg-muted/20 rounded-lg border border-muted">
                              <Clock className="h-5 w-5 text-muted-foreground/60 mb-1" />
                              <span className="text-xs text-muted-foreground font-medium">
                                Folga
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legenda */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 sm:p-4 border border-muted">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="truncate">Dia de trabalho</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="truncate">Folga</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Horário</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">Intervalo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Fechar
              </Button>
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
          <h3 className="text-lg font-semibold mb-2">
            Nenhum agente encontrado
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Não há agentes cadastrados no sistema.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className="transition-all duration-200 ease-in-out hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.nome}
                      />
                      <AvatarFallback>
                        {agent.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
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
                    <span className="text-muted-foreground">Prévia da escala:</span>
                    <div className="flex flex-nowrap overflow-x-auto gap-1 mt-1 pb-1">
                      {(agent.dias_trabalho || []).map((dia) => {
                        const horario = agent.horarios[dia];

                        

                        
                        return (
                          <Badge 
                            key={dia} 
                            variant={horario ? "default" : "outline"}
                            className={`flex-shrink-0 ${horario ? "bg-primary" : "text-muted-foreground border-muted"}`}
                          >
                            {dia}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowDetailsDialog(true);
                  }}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Prepara os dados do agente para edição
                    const agentForEdit = {
                      ...agent,
                      horarios: agent.horarios || {},
                      dias_trabalho: agent.dias_trabalho || [],
                    };
                    setEditingAgent(agentForEdit);
                    setShowEditDialog(true);
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
  );
};

export default AgentesPage;
