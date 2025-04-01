"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentCard } from "@/components/agent-card";

type StatusType =
  | "all"
  | "feedback"
  | "meeting"
  | "yoga"
  | "approved-break"
  | "bathroom"
  | "external"
  | "available"
  | "unavailable";

type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  agent_status?: { id: string; name: string };
  login_status: boolean;
};

function FreshChatTab() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<"all" | "online" | "offline">("all");

  // Função para buscar os agentes da API
  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/proxy");
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    // Filtrar pelo status
    if (statusFilter !== "all" && statusFilter !== "available" && statusFilter !== "unavailable") {
      if (statusFilter === "feedback" && agent.agent_status?.id !== "633ef7ea-a1ce-4b27-8392-59d889bc364c") return false;
      if (statusFilter === "meeting" && agent.agent_status?.id !== "bc87d9ab-5182-4262-869d-3c15becafed7") return false;
      if (statusFilter === "yoga" && agent.agent_status?.id !== "89a84427-67ba-49ef-a29c-9bd3438bf314") return false;
      if (statusFilter === "approved-break" && agent.agent_status?.id !== "08c972df-8a8b-478f-9312-19ba67d7dc79") return false;
      if (statusFilter === "bathroom" && agent.agent_status?.id !== "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3") return false;
      if (statusFilter === "external" && agent.agent_status?.id !== "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298") return false;
    }

    // Filtrar pela disponibilidade
    if (availability !== "all" && agent.login_status !== (availability === "online")) {
      return false;
    }

    // Filtrar pela busca
    if (
      searchQuery &&
      !agent.first_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[15px] font-semibold">Agentes no FreshChat</h1>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchAgents}>
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou e-mail..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="feedback">💙 Feedback</SelectItem>
            <SelectItem value="meeting">👥 Reunião/Treinamento</SelectItem>
            <SelectItem value="yoga">⏰ Yooga Time</SelectItem>
            <SelectItem value="approved-break">🚨 Pausa - Aprovada</SelectItem>
            <SelectItem value="bathroom">💧 Água/Banheiro</SelectItem>
            <SelectItem value="external">💼 Demandas Externas</SelectItem>
            <SelectItem value="available">✅ Disponível</SelectItem>
            <SelectItem value="unavailable">❌ Indisponível</SelectItem>
          </SelectContent>
        </Select>

        <Select value={availability} onValueChange={(value) => setAvailability(value as "all" | "online" | "offline")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por disponibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
        ) : (
          <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Nenhum agente corresponde aos filtros atuais</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Exportação padrão necessária para arquivos de página no Next.js
export default function Page() {
  return <FreshChatTab />;
}