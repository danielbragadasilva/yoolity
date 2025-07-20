// app/api/sync-users-xano/route.ts
import { NextResponse } from "next/server";

const FRESHCHAT_API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=100";
const FRESHCHAT_BEARER_TOKEN = process.env.FRESHCHAT_BEARER_TOKEN!;
const XANO_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:vPyGy-ov"; // Substitua pela URL correta do seu Xano
const XANO_API_KEY = process.env.XANO_API_KEY; // Adicione sua chave da API do Xano no .env

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

interface XanoUser {
  freshchat_id: string;
  nome: string;
  email: string;
  avatar_url: string;
  cargo: string;
  turno: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Mapeamento de role_id para cargo
const roleMapping: Record<string, string> = {
  "855dd18d-0b29-4f2a-a6ad-931027963b9d": "Coordenador",
  "72bf957d-f2b7-41db-aa6f-8146351e4685": "Agente",
  // Adicione outros role_ids conforme necessário
};

// Função para determinar o turno baseado em alguma lógica (você pode ajustar)
function determineTurno(agent: FreshchatAgent): string {
  // Por enquanto, vamos usar uma lógica simples baseada no ID
  // Você pode implementar uma lógica mais sofisticada aqui
  const id = parseInt(agent.id);
  if (id % 3 === 0) return "Manhã";
  if (id % 3 === 1) return "Tarde";
  return "Noite";
}

export async function POST() {
  try {
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
    
    // 2. Filtrar apenas agentes com roles permitidos e IDs permitidos
    const allowedRoles = [
      "855dd18d-0b29-4f2a-a6ad-931027963b9d", // coordenador
      "72bf957d-f2b7-41db-aa6f-8146351e4685", // agente
    ];

    const filteredAgents = agents.filter(agent => 
      agent.role_id && 
      allowedRoles.includes(agent.role_id) && 
      allowedIds.includes(agent.id)
    );

    // 3. Transformar dados para o formato do Xano
    const xanoUsers: XanoUser[] = filteredAgents.map(agent => ({
      freshchat_id: agent.id,
      nome: `${agent.first_name} ${agent.last_name}`.trim(),
      email: agent.email,
      avatar_url: agent.avatar?.url || "",
      cargo: roleMapping[agent.role_id!] || "Agente",
      turno: determineTurno(agent),
      status: agent.login_status ? "ativo" : "inativo",
      updated_at: new Date().toISOString(),
    }));

    // 4. Sincronizar com Xano
    const syncResults = [];
    
    for (const user of xanoUsers) {
      try {
        // Primeiro, verificar se o usuário já existe
        const checkResponse = await fetch(`${XANO_API_URL}/users?freshchat_id=${user.freshchat_id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(XANO_API_KEY && { "Authorization": `Bearer ${XANO_API_KEY}` }),
          },
        });

        let result;
        if (checkResponse.ok) {
          const existingUsers = await checkResponse.json();
          
          if (existingUsers.length > 0) {
            // Usuário existe, fazer UPDATE
            const updateResponse = await fetch(`${XANO_API_URL}/users/${existingUsers[0].id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                ...(XANO_API_KEY && { "Authorization": `Bearer ${XANO_API_KEY}` }),
              },
              body: JSON.stringify(user),
            });
            
            result = {
              action: "updated",
              user: user.nome,
              success: updateResponse.ok,
              status: updateResponse.status,
            };
          } else {
            // Usuário não existe, fazer CREATE
            const createResponse = await fetch(`${XANO_API_URL}/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(XANO_API_KEY && { "Authorization": `Bearer ${XANO_API_KEY}` }),
              },
              body: JSON.stringify({ ...user, created_at: new Date().toISOString() }),
            });
            
            result = {
              action: "created",
              user: user.nome,
              success: createResponse.ok,
              status: createResponse.status,
            };
          }
        } else {
          result = {
            action: "error",
            user: user.nome,
            success: false,
            error: "Erro ao verificar usuário existente",
          };
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

    return NextResponse.json({
      message: "Sincronização concluída",
      total_agents: filteredAgents.length,
      success_count: successCount,
      error_count: errorCount,
      results: syncResults,
    });

  } catch (error: any) {
    console.error("Erro na sincronização:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
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
    
    const allowedRoles = [
      "855dd18d-0b29-4f2a-a6ad-931027963b9d",
      "72bf957d-f2b7-41db-aa6f-8146351e4685",
    ];

    const filteredAgents = agents.filter(agent => 
      agent.role_id && 
      allowedRoles.includes(agent.role_id) && 
      allowedIds.includes(agent.id)
    );

    return NextResponse.json({
      total_freshchat_agents: agents.length,
      filtered_agents: filteredAgents.length,
      agents: filteredAgents.map(agent => ({
        id: agent.id,
        nome: `${agent.first_name} ${agent.last_name}`.trim(),
        email: agent.email,
        cargo: roleMapping[agent.role_id!] || "Agente",
        status: agent.login_status ? "ativo" : "inativo",
      })),
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}