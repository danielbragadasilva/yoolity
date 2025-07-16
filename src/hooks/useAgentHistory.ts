// hooks/useAgentHistory.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type HistoryEntry = {
  id: string;
  agent_id: string;
  status_id: string;
  changed_at: string;
};

export const useAgentHistory = (agentId: string, currentStatusId: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  // Carrega histórico do Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("agent_status_history")
        .select("*")
        .eq("agent_id", agentId)
        .order("changed_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setHistory(data);
        setLastChanged(new Date(data[0]?.changed_at));
      }
    };

    if (agentId) fetchHistory();
  }, [agentId]);

  // Detecta alteração de status e grava no Supabase
  useEffect(() => {
    const saveStatusChange = async () => {
      if (!agentId || !currentStatusId) return;

      const last = history[0]?.status_id;
      if (last === currentStatusId) return;

      const { error } = await supabase.from("agent_status_history").insert({
        agent_id: agentId,
        status_id: currentStatusId,
        changed_at: new Date().toISOString(),
      });

      if (!error) {
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            agent_id: agentId,
            status_id: currentStatusId,
            changed_at: new Date().toISOString(),
          },
          ...prev.slice(0, 4),
        ]);
        setLastChanged(new Date());
      }
    };

    saveStatusChange();
  }, [currentStatusId]);

  return { history, lastChanged };
};
