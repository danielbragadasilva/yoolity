"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  agent_status?: { id: string; name: string };
  login_status: boolean;
};

export function AgentCard({ agent }: { agent: Agent }) {
  const agentStates: { [key: string]: string } = {
    "633ef7ea-a1ce-4b27-8392-59d889bc364c": "💙Feedback💙",
    "bc87d9ab-5182-4262-869d-3c15becafed7": "👥Reunião/Treinamento👥",
    "89a84427-67ba-49ef-a29c-9bd3438bf314": "⏰Yooga Time⏰",
    "08c972df-8a8b-478f-9312-19ba67d7dc79": "🚨Pausa - Aprovada🚨",
    "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "💧Água/Banheiro💩",
    "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "💼Demandas Externas💼",
    "Active on Intelli Assign": "✅ Disponível",
    "Inactive on Intelli Assign": "❌ Indisponível",
  };

  const getStatusEmoji = (status: string) => {
    return agentStates[status] || "Status Desconhecido";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "633ef7ea-a1ce-4b27-8392-59d889bc364c":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bc87d9ab-5182-4262-869d-3c15becafed7":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "89a84427-67ba-49ef-a29c-9bd3438bf314":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "08c972df-8a8b-478f-9312-19ba67d7dc79":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298":
        return "bg-orange-100 text-gray-800 dark:bg-orange-300 dark:text-gray-300";
      case "Active on Intelli Assign":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Inactive on Intelli Assign":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const agentStatusId =
    agent.agent_status?.id || agent.agent_status?.name || "Inactive on Intelli Assign";

  const [statusDuration, setStatusDuration] = useState<string>("");
  const [history, setHistory] = useState<
    { status_id: string; timestamp: string }[]
  >([]);

  // Armazena alterações no localStorage
  useEffect(() => {
    if (!agent.id || !agentStatusId) return;

    const local = localStorage.getItem("agents_status");
    const parsed = local ? JSON.parse(local) : {};

    const currentLog = parsed[agent.id] || {
      history: [],
      last_updated: null,
    };

    const lastStatus = currentLog.history?.[currentLog.history.length - 1]?.status_id;

    if (lastStatus !== agentStatusId) {
      const newEntry = {
        status_id: agentStatusId,
        timestamp: new Date().toISOString(),
      };

      const updatedLog = {
        ...currentLog,
        last_updated: newEntry.timestamp,
        history: [...(currentLog.history || []), newEntry],
      };

      parsed[agent.id] = updatedLog;
      localStorage.setItem("agents_status", JSON.stringify(parsed));
    }
  }, [agent.id, agentStatusId]);

  // Atualiza a duração desde a última alteração
  useEffect(() => {
    const updateDuration = () => {
      const local = localStorage.getItem("agents_status");
      if (!local) return;

      const parsed = JSON.parse(local);
      const log = parsed[agent.id];

      if (!log || !log.last_updated) return;

      const updated = new Date(log.last_updated);
      const now = new Date();
      const diffMs = now.getTime() - updated.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffSec = Math.floor((diffMs % 60000) / 1000);

      const label =
        diffMin >= 1
          ? `${diffMin} min${diffMin > 1 ? "s" : ""}`
          : `${diffSec} seg${diffSec !== 1 ? "s" : ""}`;

      setStatusDuration(label);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [agent.id]);

  const handleOpenHistory = () => {
    const local = localStorage.getItem("agents_status");
    if (!local) return;

    const parsed = JSON.parse(local);
    const log = parsed[agent.id];
    if (!log || !log.history) return;

    setHistory(log.history.slice().reverse()); // mais recentes primeiro
  };

  return (
    <Dialog>
      <Card className="overflow-hidden">
        <div className="h-3 bg-primary" />
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Avatar className="h-10 w-10 border items-start">
              <AvatarImage
                src={agent.avatar.url || "https://ui.shadcn.com/placeholder.svg"}
                alt={agent.first_name}
              />
              <AvatarFallback className="text-primary-darkest-opaque">
                {agent.first_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[12px]">
                  {agent.first_name} {agent.last_name}
                </h3>
              </div>
              <p className="text-[10px] text-muted-foreground text-primary-darker">
                {agent.email}
              </p>

              <DialogTrigger asChild>
                <div
                  onClick={handleOpenHistory}
                  className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium cursor-pointer ${getStatusColor(
                    agentStatusId
                  )}`}
                >
                  {getStatusEmoji(agentStatusId)} {statusDuration}
                </div>
              </DialogTrigger>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Histórico de status de {agent.first_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-72 overflow-auto pr-1">
          {history.length > 0 ? (
            history.map((item, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-2">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className={`${getStatusColor(item.status_id)} px-2 py-1 rounded-full`}>
                      {getStatusEmoji(item.status_id)}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(item.timestamp).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhum histórico de status encontrado.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
