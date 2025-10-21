"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  login_status: boolean;
  availability_status: string; // Status de disponibilidade
  agent_status?: { id: string; name: string }; // Status do agente no Freshchat
  role_id?: string;
};

// Cache global para evitar requisições desnecessárias
let globalCache: { data: Agent[]; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 segundos de cache
const UPDATE_INTERVAL = 60000; // Atualiza a cada 60 segundos (menos frequente)

export function useFreshchatAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const allowedRoles = useMemo(() => [
    "855dd18d-0b29-4f2a-a6ad-931027963b9d", // coordenador
    "72bf957d-f2b7-41db-aa6f-8146351e4685", // agente
    "AGENT", // Agent - Andréa Guarani
  ], []);

  // Lista de IDs permitidos
  const allowedIds = useMemo(() => [
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
  ], []);

  // Função para verificar se os dados mudaram significativamente
  const hasSignificantChanges = useCallback((newAgents: Agent[], currentAgents: Agent[]) => {
    if (newAgents.length !== currentAgents.length) return true;
    
    // Verifica mudanças importantes (status, login, etc.)
    return newAgents.some((newAgent, index) => {
      const currentAgent = currentAgents[index];
      if (!currentAgent) return true;
      
      return (
        newAgent.login_status !== currentAgent.login_status ||
        newAgent.availability_status !== currentAgent.availability_status ||
        newAgent.email !== currentAgent.email
      );
    });
  }, []);

  const fetchAgents = useCallback(async (forceUpdate = false) => {
    // Verifica cache primeiro
    if (!forceUpdate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      const filteredData = globalCache.data.filter((a) => 
        allowedRoles.includes(a.role_id || "") && allowedIds.includes(a.id)
      );
      if (hasSignificantChanges(filteredData, agents) || isInitialLoad) {
        setAgents(filteredData);
        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
      return;
    }

    // Só mostra loading na primeira carga
    if (isInitialLoad) {
      setLoading(true);
    }

    try {
      const res = await fetch("/api/proxy");
      const data = await res.json();
      const newAgents = data.agents || [];
      
      // Atualiza cache global
      globalCache = {
        data: newAgents,
        timestamp: Date.now()
      };
      
      const filteredData = newAgents.filter((a: Agent) => 
        allowedRoles.includes(a.role_id || "") && allowedIds.includes(a.id)
      );
      
      // Só atualiza se houver mudanças significativas ou for a primeira carga
      if (hasSignificantChanges(filteredData, agents) || isInitialLoad) {
        if (mountedRef.current) {
          setAgents(filteredData);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar agentes:", err);
      // Em caso de erro, mantém os dados atuais se existirem
    } finally {
      if (isInitialLoad && mountedRef.current) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, [agents, allowedRoles, hasSignificantChanges, isInitialLoad, allowedIds]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Primeira carga
    fetchAgents(true);
    
    // Configura intervalo menos frequente
    intervalRef.current = setInterval(() => {
      fetchAgents();
    }, UPDATE_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchAgents]);

  // Função para forçar atualização (útil para sincronização manual)
  const refreshAgents = useCallback(() => {
    fetchAgents(true);
  }, [fetchAgents]);

  const filteredAgents = agents.filter((a) =>
    allowedRoles.includes(a.role_id || "") && allowedIds.includes(a.id)
  );

  return { 
    agents: filteredAgents, 
    loading: loading && isInitialLoad, // Só mostra loading na primeira carga
    refreshAgents 
  };
}
