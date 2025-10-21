"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  role_id?: string;
};

function handleTrack(agents: Agent[]) {
  const local = localStorage.getItem("agents_status");
  const current: Record<
    string,
    {
      status_id: string;
      last_updated: string;
    }
  > = local ? JSON.parse(local) : {};

  const now = new Date().toISOString();

  agents.forEach((agent) => {
    const currentId = agent.agent_status?.id || agent.agent_status?.name || "Inactive on Intelli Assign";

    if (!current[agent.id]) {
      current[agent.id] = {
        status_id: currentId,
        last_updated: now,
      };
    } else if (current[agent.id].status_id !== currentId) {
      current[agent.id] = {
        status_id: currentId,
        last_updated: now,
      };
    }
  });

  localStorage.setItem("agents_status", JSON.stringify(current));
}

function FreshChatTab() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allowedRoles = [
    "855dd18d-0b29-4f2a-a6ad-931027963b9d",
    "72bf957d-f2b7-41db-aa6f-8146351e4685",
  ];

  // Lista de IDs permitidos
  const allowedIds = [
    "fd553095-3084-43bf-a1e1-7268082c336c",
    "8adf9899-3924-4340-8538-3a7fd1e99127",
    "28981349-9b86-4444-8016-adeaea56c0af",
    "61270de4-eab0-4030-bd58-c344317fb99a",
    "c344c55f-6cb5-4f9c-b0c4-f22e5a50aab0",
    "092f21ae-1afb-43aa-99b1-b5c6af5a64df",
    "1b606bd9-9ac5-475f-b553-91553aa369d7",
    "26bf4689-4e97-4a52-a6c7-43b6545378e8",
    "1a4d93db-f11c-4b5a-8d2b-8556f734ebbc",
    "43b5a51f-9727-4932-8570-d13ea59442d9",
    "487010b9-0082-4738-9647-7f26dffa3086",
    "5a8d3c94-6d4c-4564-818b-a1e90816188c",
    "83110aee-7535-43e9-98e3-1bfb9d4cc09a",
    "9f9a5eff-8d86-41c9-962a-1942ffbc5315" // Sofia
  ];

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/proxy");
      const data = await response.json();
      setAgents(data.agents || []);
      handleTrack(data.agents || []);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    if (!allowedRoles.includes(agent.role_id || "") || !allowedIds.includes(agent.id)) return false;

    if (
      statusFilter !== "all" &&
      statusFilter !== "available" &&
      statusFilter !== "unavailable"
    ) {
      const statusMap: Record<string, string> = {
        feedback: "633ef7ea-a1ce-4b27-8392-59d889bc364c",
        meeting: "bc87d9ab-5182-4262-869d-3c15becafed7",
        yoga: "89a84427-67ba-49ef-a29c-9bd3438bf314",
        "approved-break": "08c972df-8a8b-478f-9312-19ba67d7dc79",
        bathroom: "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3",
        external: "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298",
      };
      if (agent.agent_status?.id !== statusMap[statusFilter]) return false;
    }



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

export default function Page() {
  return <FreshChatTab />;
}
