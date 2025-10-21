import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FreshchatAgent {
  id: string;
  first_name: string;
  availability_status: string;
}

interface StatusChange {
  agent_id: string;
  agent_name: string;
  new_status: string;
  previous_status: string;
  timestamp: string;
}

const API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=100";
const BEARER_TOKEN = process.env.FRESHCHAT_BEARER_TOKEN!;

// Cache local para comparação de status (dura apenas durante o runtime da instância)
const lastStatuses: Record<string, string> = {};

export async function GET() {
  try {
    console.log("Iniciando monitoramento de status dos agentes Freshchat...");

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar agentes: ${response.status}`);
    }

    const { agents }: { agents: FreshchatAgent[] } = await response.json();
    console.log(`Total de agentes encontrados: ${agents.length}`);
    
    // Lista de IDs permitidos
    const allowedIds = [
      "fd553095-3084-43bf-a1e1-7268082c336c",
      "8adf9899-3924-4340-8538-3a7fd1e99127",
      "28981349-9b86-4444-8016-adeaea56c0af",
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
    ];
    
    // Filtrar apenas os agentes com IDs permitidos
    const filteredAgents = agents.filter((agent: FreshchatAgent) => allowedIds.includes(agent.id));
    console.log(`Agentes filtrados: ${filteredAgents.length}`);
    
    const now = new Date();
    const changes: StatusChange[] = [];
    const statusLogs = [];

    // Verificar mudanças de status
    for (const agent of filteredAgents) {
      const currentStatus = agent.availability_status;
      const previousStatus = lastStatuses[agent.id];

      if (currentStatus !== previousStatus) {
        const change = {
          agent_id: agent.id,
          agent_name: agent.first_name,
          new_status: currentStatus,
          previous_status: previousStatus ?? "UNKNOWN",
          timestamp: now.toISOString(),
        };
        
        changes.push(change);
        lastStatuses[agent.id] = currentStatus;

        // Buscar o agente no Supabase para obter o ID interno
        try {
          const agentRecord = await prisma.agent.findFirst({
            where: {
              freshchat_id: agent.id
            },
            select: {
              id: true
            }
          });

          if (agentRecord) {
            statusLogs.push({
              agent_id: agentRecord.id,
              status_anterior: previousStatus || "UNKNOWN",
              status_novo: currentStatus,
              timestamp: now,
              detalhes: `Mudança detectada via monitoramento automático: ${agent.first_name}`
            });
          } else {
            console.warn(`Agente ${agent.id} (${agent.first_name}) não encontrado no Supabase`);
          }
        } catch (error) {
          console.error(`Erro ao buscar agente ${agent.id}:`, error);
        }
      }
    }

    // Salvar logs de status no Supabase se houver mudanças
    if (statusLogs.length > 0) {
      try {
        await prisma.statusLog.createMany({
          data: statusLogs
        });
        console.log(`${statusLogs.length} logs de status salvos no Supabase`);
      } catch (error) {
        console.error("Erro ao salvar logs de status no Supabase:", error);
        throw new Error(`Erro ao salvar logs no Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    console.log(`Monitoramento concluído: ${changes.length} mudanças detectadas`);

    return NextResponse.json({
      message: "Monitoramento executado",
      total_agents_monitored: filteredAgents.length,
      total_changes: changes.length,
      changes,
      logs_saved: statusLogs.length
    });

  } catch (error: unknown) {
    console.error("Erro no monitoramento:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Endpoint POST para forçar verificação de status de um agente específico
export async function POST(request: Request) {
  try {
    const { agent_id, force_log = false } = await request.json();

    if (!agent_id) {
      return NextResponse.json(
        { error: "agent_id é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar status atual do agente no Freshchat
    const response = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar agentes: ${response.status}`);
    }

    const { agents }: { agents: FreshchatAgent[] } = await response.json();
    const agent = agents.find(a => a.id === agent_id);

    if (!agent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    // Buscar agente no Supabase
    const agentRecord = await prisma.agent.findFirst({
      where: {
        freshchat_id: agent_id
      }
    });

    if (!agentRecord) {
      return NextResponse.json(
        { error: "Agente não encontrado no Supabase" },
        { status: 404 }
      );
    }

    const currentStatus = agent.availability_status;
    const previousStatus = lastStatuses[agent_id] || "UNKNOWN";
    const now = new Date();

    // Forçar log ou apenas se houver mudança
    if (force_log || currentStatus !== previousStatus) {
      await prisma.statusLog.create({
        data: {
          agent_id: agentRecord.id,
          status_anterior: previousStatus,
          status_novo: currentStatus,
          timestamp: now,
          detalhes: force_log 
            ? `Log forçado via API: ${agent.first_name}` 
            : `Mudança detectada via verificação manual: ${agent.first_name}`
        }
      });

      lastStatuses[agent_id] = currentStatus;

      return NextResponse.json({
        message: "Log de status criado",
        agent_name: agent.first_name,
        previous_status: previousStatus,
        new_status: currentStatus,
        timestamp: now.toISOString()
      });
    } else {
      return NextResponse.json({
        message: "Nenhuma mudança de status detectada",
        agent_name: agent.first_name,
        current_status: currentStatus,
        timestamp: now.toISOString()
      });
    }

  } catch (error: unknown) {
    console.error("Erro na verificação manual:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
