// app/api/freshchat-monitor/route.ts
import { NextResponse } from "next/server";

const API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=100";
const BEARER_TOKEN = process.env.FRESHCHAT_BEARER_TOKEN!;
const XANO_WEBHOOK_URL = "https://x8ki-letl-twmt.n7.xano.io/api:vPyGy-ov/log-status"; // Substitua se necessário

// Cache local para comparação de status (dura apenas durante o runtime da instância)
let lastStatuses: Record<string, string> = {};

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar agentes: ${response.status}`);
    }

    const { agents } = await response.json();
    
    // Lista de IDs permitidos
    const allowedIds = [
      "8adf9899-3924-4340-8538-3a7fd1e99127",
      "28981349-9b86-4444-8016-adeaea56c0af",
      "61270de4-eab0-4030-bd58-c344317fb99a",
      "3675a143-cc9c-4382-9e16-ca05d396aba9",
      "c344c55f-6cb5-4f9c-b0c4-f22e5a50aab0",
      "092f21ae-1afb-43aa-99b1-b5c6af5a64df",
      "1b606bd9-9ac5-475f-b553-91553aa369d7",
      "65621928-bbba-41ee-8350-6780138e6f7e",
      "26bf4689-4e97-4a52-a6c7-43b6545378e8",
      "1a4d93db-f11c-4b5a-8d2b-8556f734ebbc",
      "43b5a51f-9727-4932-8570-d13ea59442d9",
      "487010b9-0082-4738-9647-7f26dffa3086",
      "9f9a5eff-8d86-41c9-962a-1942ffbc5315",
      "5a8d3c94-6d4c-4564-818b-a1e90816188c",
      "83110aee-7535-43e9-98e3-1bfb9d4cc09a"
    ];
    
    // Filtrar apenas os agentes com IDs permitidos
    const filteredAgents = agents.filter(agent => allowedIds.includes(agent.id));
    
    const now = new Date().toISOString();
    const changes = [];

    for (const agent of filteredAgents) {
      const currentStatus = agent.availability_status;
      const previousStatus = lastStatuses[agent.id];

      if (currentStatus !== previousStatus) {
        changes.push({
          agent_id: agent.id,
          agent_name: agent.first_name,
          new_status: currentStatus,
          previous_status: previousStatus ?? "UNKNOWN",
          timestamp: now,
        });

        lastStatuses[agent.id] = currentStatus;
      }
    }

    if (changes.length > 0) {
      const xanoResponse = await fetch(XANO_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });

      if (!xanoResponse.ok) {
        const text = await xanoResponse.text();
        throw new Error(`Erro ao enviar para Xano: ${xanoResponse.status} - ${text}`);
      }
    }

    return NextResponse.json({
      message: "Monitoramento executado",
      total_changes: changes.length,
      changes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
