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
    const now = new Date().toISOString();
    const changes = [];

    for (const agent of agents) {
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
