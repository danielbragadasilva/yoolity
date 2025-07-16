'use client';

import { useEffect, useState } from "react";
import { trackAgentStatuses } from "@/lib/statusTracker";

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

export default function StatusLogPage() {
  const [logs, setLogs] = useState<Record<string, AgentStatusEntry>>({});

  const loadLogs = () => {
    const data = localStorage.getItem("agents_status");
    if (data) {
      setLogs(JSON.parse(data));
    }
  };

  const handleTrack = async () => {
    await trackAgentStatuses();
    loadLogs();
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⏱️ Monitoramento de Status dos Agentes</h1>
      <button
        onClick={handleTrack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔄 Atualizar Agora
      </button>

      {Object.entries(logs).length === 0 && (
        <p className="mt-4 text-gray-600">Nenhum log disponível ainda.</p>
      )}

      <div className="mt-6 space-y-6">
        {Object.entries(logs).map(([agentId, data]) => (
          <div key={agentId} className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-2">👤 Agente: {agentId}</h2>
            <p>Status atual: <strong>{data.last_status}</strong> (desde {new Date(data.last_updated).toLocaleTimeString()})</p>

            <h3 className="font-semibold mt-4">Histórico:</h3>
            <ul className="list-disc ml-6">
              {data.log.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.status}</strong> - {new Date(entry.from).toLocaleTimeString()} → {new Date(entry.to).toLocaleTimeString()} ({entry.duration_minutes} min)
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
