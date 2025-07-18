"use client";

import { useFreshchatAgents } from "@/hooks/useFreshchatAgents";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function AgentesOn() {
  const { agents, loading } = useFreshchatAgents();

  // Agora usa availability_status
  const total = agents.length;
  const online = agents.filter(
    (a) => a.availability_status === "AVAILABLE"
  ).length;
  const percent = total > 0 ? Math.round((online / total) * 100) : 0;

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <div className="text-2xl font-bold">{online}/{total}</div>
            <p className="text-xs text-muted-foreground">
              {percent}% da equipe trabalhando agora
            </p>
          </>
        )}
      </CardContent>
    </>
  );
}
