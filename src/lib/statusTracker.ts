const statusMap: Record<string, string> = {
  "633ef7ea-a1ce-4b27-8392-59d889bc364c": "💙Feedback💙",
  "bc87d9ab-5182-4262-869d-3c15becafed7": "👥Reunião/Treinamento👥",
  "89a84427-67ba-49ef-a29c-9bd3438bf314": "⏰Yooga Time⏰",
  "08c972df-8a8b-478f-9312-19ba67d7dc79": "🚨Pausa - Aprovada🚨",
  "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "💧Água/Banheiro💩",
  "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "💼Demandas Externas💼",
  "Active on Intelli Assign": "✅ Disponível",
  "Inactive on Intelli Assign": "❌ Indisponível"
};

type AgentLogEntry = {
  status: string;
  from: string;
  to: string;
  duration_minutes: number;
};

type AgentStatusEntry = {
  last_status: string;
  last_updated: string;
  log: AgentLogEntry[];
};

export async function trackAgentStatuses() {
  const res = await fetch("/api/proxy");
  const data = await res.json();

  const localData = JSON.parse(localStorage.getItem("agents_status") || "{}") as Record<string, AgentStatusEntry>;
  const now = new Date().toISOString();

  for (const agent of data.agents) {
    const agentId = agent.id;
    const rawStatus = agent.agent_status?.name || "Desconhecido";
    const currentStatus = statusMap[rawStatus] || rawStatus;

    if (!localData[agentId]) {
      // Primeiro registro
      localData[agentId] = {
        last_status: currentStatus,
        last_updated: now,
        log: [],
      };
    } else {
      const last = localData[agentId];
      if (last.last_status !== currentStatus) {
        const from = new Date(last.last_updated);
        const to = new Date(now);
        const duration = Math.round((to.getTime() - from.getTime()) / 60000); // minutos

        last.log.push({
          status: last.last_status,
          from: last.last_updated,
          to: now,
          duration_minutes: duration,
        });

        // Atualiza status atual
        last.last_status = currentStatus;
        last.last_updated = now;
      }
    }
  }

  localStorage.setItem("agents_status", JSON.stringify(localData));
}
