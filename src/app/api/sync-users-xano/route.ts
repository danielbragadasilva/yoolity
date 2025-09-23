import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FRESHCHAT_API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=100";
const FRESHCHAT_BEARER_TOKEN = process.env.FRESHCHAT_BEARER_TOKEN!;

interface FreshchatAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  login_status: boolean;
  availability_status: string;
  agent_status?: { id: string; name: string };
  role_id?: string;
}

interface SupabaseUser {
  freshchat_id: string;
  nome: string;
  email: string;
  avatar_url: string;
  cargo: string;
  turno: string;
  status: string;
}

// Mapeamento de roles do Freshchat para cargos
const roleMapping: Record<string, string> = {
  "855dd18d-0b29-4f2a-a6ad-931027963b9d": "Coordenador",
  "72bf957d-f2b7-41db-aa6f-8146351e4685": "Agente",
};

// Função para determinar o turno baseado no status do agente
function determineTurno(agent: FreshchatAgent): string {
  // Lógica simples - pode ser expandida conforme necessário
  if (agent.availability_status === "available") {
    return "Manhã";
  }
  return "Tarde";
}

export async function POST() {
  try {
    console.log("Iniciando sincronização de usuários do Freshchat para Supabase...");

    // 1. Buscar agentes do Freshchat
    const freshchatResponse = await fetch(FRESHCHAT_API_URL, {
      headers: {
        Authorization: `Bearer ${FRESHCHAT_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!freshchatResponse.ok) {
      throw new Error(`Erro ao buscar agentes do Freshchat: ${freshchatResponse.status}`);
    }

    const { agents }: { agents: FreshchatAgent[] } = await freshchatResponse.json();
    console.log(`Total de agentes encontrados no Freshchat: ${agents.length}`);

    // 2. Filtrar agentes por IDs e roles permitidos
    const allowedIds = [
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
    ];
    
    const allowedRoles = [
      "855dd18d-0b29-4f2a-a6ad-931027963b9d",
      "72bf957d-f2b7-41db-aa6f-8146351e4685",
    ];

    const filteredAgents = agents.filter(agent => 
      agent.role_id && 
      allowedRoles.includes(agent.role_id) && 
      allowedIds.includes(agent.id)
    );

    console.log(`Agentes filtrados: ${filteredAgents.length}`);

    // 3. Transformar dados para o formato do Supabase
    const supabaseUsers: SupabaseUser[] = filteredAgents.map(agent => ({
      freshchat_id: agent.id,
      nome: `${agent.first_name} ${agent.last_name}`.trim(),
      email: agent.email,
      avatar_url: agent.avatar?.url || "",
      cargo: roleMapping[agent.role_id!] || "Agente",
      turno: determineTurno(agent),
      status: agent.login_status ? "ativo" : "inativo",
    }));

    // 4. Sincronizar com Supabase usando Prisma
    const syncResults = [];
    
    for (const user of supabaseUsers) {
      try {
        // Verificar se o usuário já existe
        const existingAgent = await prisma.agent.findFirst({
          where: {
            freshchat_id: user.freshchat_id
          }
        });

        let result;
        if (existingAgent) {
          // Usuário existe, fazer UPDATE
          try {
            await prisma.agent.update({
              where: { id: existingAgent.id },
              data: {
                nome: user.nome,
                email: user.email,
                avatar_url: user.avatar_url,
                cargo: user.cargo,
                turno: user.turno,
                status: user.status,
                updated_at: new Date()
              }
            });
            
            result = {
              action: "updated",
              user: user.nome,
              success: true,
              status: 200,
            };
          } catch (updateError) {
            result = {
              action: "error",
              user: user.nome,
              success: false,
              error: updateError instanceof Error ? updateError.message : "Erro ao atualizar",
            };
          }
        } else {
          // Usuário não existe, fazer CREATE
          try {
            await prisma.agent.create({
              data: {
                freshchat_id: user.freshchat_id,
                nome: user.nome,
                email: user.email,
                avatar_url: user.avatar_url,
                cargo: user.cargo,
                turno: user.turno,
                status: user.status
              }
            });
            
            result = {
              action: "created",
              user: user.nome,
              success: true,
              status: 201,
            };
          } catch (createError) {
            result = {
              action: "error",
              user: user.nome,
              success: false,
              error: createError instanceof Error ? createError.message : "Erro ao criar",
            };
          }
        }
        
        syncResults.push(result);
      } catch (error) {
        syncResults.push({
          action: "error",
          user: user.nome,
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    const successCount = syncResults.filter(r => r.success).length;
    const errorCount = syncResults.filter(r => !r.success).length;

    console.log(`Sincronização concluída: ${successCount} sucessos, ${errorCount} erros`);

    return NextResponse.json({
      message: "Sincronização concluída",
      total_agents: filteredAgents.length,
      success_count: successCount,
      error_count: errorCount,
      results: syncResults,
    });

  } catch (error: unknown) {
    console.error("Erro na sincronização:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Endpoint GET para verificar status da sincronização
export async function GET() {
  try {
    // Buscar dados do Freshchat para mostrar quantos agentes estão disponíveis
    const freshchatResponse = await fetch(FRESHCHAT_API_URL, {
      headers: {
        Authorization: `Bearer ${FRESHCHAT_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!freshchatResponse.ok) {
      throw new Error(`Erro ao buscar agentes do Freshchat: ${freshchatResponse.status}`);
    }

    const { agents }: { agents: FreshchatAgent[] } = await freshchatResponse.json();
    
    // Lista de IDs permitidos
    const allowedIds = [
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
    ];
    
    const allowedRoles = [
      "855dd18d-0b29-4f2a-a6ad-931027963b9d",
      "72bf957d-f2b7-41db-aa6f-8146351e4685",
    ];

    const filteredAgents = agents.filter(agent => 
      agent.role_id && 
      allowedRoles.includes(agent.role_id) && 
      allowedIds.includes(agent.id)
    );

    // Buscar agentes sincronizados no Supabase
    const syncedAgents = await prisma.agent.findMany({
      where: {
        freshchat_id: {
          in: filteredAgents.map(agent => agent.id)
        }
      },
      select: {
        id: true,
        freshchat_id: true,
        nome: true,
        email: true,
        cargo: true,
        status: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      total_freshchat_agents: agents.length,
      filtered_agents: filteredAgents.length,
      synced_agents: syncedAgents.length,
      agents: filteredAgents.map(agent => {
        const syncedAgent = syncedAgents.find(sa => sa.freshchat_id === agent.id);
        return {
          id: agent.id,
          nome: `${agent.first_name} ${agent.last_name}`.trim(),
          email: agent.email,
          cargo: roleMapping[agent.role_id!] || "Agente",
          status: agent.login_status ? "ativo" : "inativo",
          synced: !!syncedAgent,
          last_sync: syncedAgent?.updated_at?.toISOString() || null
        };
      }),
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}