"use client";

import { useFreshchatAgents } from "@/hooks/useFreshchatAgents";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

// Definição do tipo Agent para garantir acesso às propriedades corretas
type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  login_status: boolean;
  availability_status: string;
  agent_status?: { id: string; name: string };
  role_id?: string;
};

export function AgentesOn() {
  const { agents, loading } = useFreshchatAgents();

  // Considera como ativos os agentes com status "Disponível"
  const total = agents.length;
  
  const online = agents.filter(
    (a) => 
      // Verifica se o agente está disponível pelo availability_status
      a.availability_status === "AVAILABLE" || 
      // Ou se tem o status "Active on Intelli Assign"
      a.agent_status?.name === "Active on Intelli Assign"
  ).length;
  const percent = total > 0 ? Math.round((online / total) * 100) : 0;

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Agentes Disponíveis</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <div className="text-2xl font-bold">{online}/{total}</div>
            <p className="text-xs text-muted-foreground">
              {percent}% da equipe disponível agora
            </p>
          </>
        )}
      </CardContent>
    </>
  );
}
