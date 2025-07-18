"use client";

import { useEffect, useState } from "react";

type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  login_status: boolean;
  availability_status: string; // <-- aqui!
  role_id?: string;
};

export function useFreshchatAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const allowedRoles = [
    "855dd18d-0b29-4f2a-a6ad-931027963b9d", // coordenador
    "72bf957d-f2b7-41db-aa6f-8146351e4685", // agente
  ];

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error("Erro ao buscar agentes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  const filteredAgents = agents.filter((a) =>
    allowedRoles.includes(a.role_id || "")
  );

  return { agents: filteredAgents, loading };
}
