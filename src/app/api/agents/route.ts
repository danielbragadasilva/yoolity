import { NextResponse } from 'next/server';

const xanoApiKey = process.env.XANO_API_KEY!;
const xanoEndpoint = process.env.XANO_ENDPOINT!;

interface WorkSchedule {
  dia: string;
  horario_inicio: string;
  horario_fim: string;
  intervalo_inicio: string;
  intervalo_fim: string;
}

export async function POST(request: Request) {
  try {
    const agent = await request.json();

    // Validar campos obrigatórios
    if (!agent.nome || !agent.email || !agent.freshchat_id) {
      return NextResponse.json(
        { error: 'Nome, email e Freshchat ID são obrigatórios' },
        { status: 400 }
      );
    }

    // Preparar dados para Xano
    const xanoData = {
      nome: agent.nome,
      email: agent.email,
      freshchat_id: agent.freshchat_id,
      horarios: Object.entries(agent.horarios)
        .filter(([dia, horario]: [string, any]) => agent.dias_trabalho.includes(dia))
        .map(([dia, horario]: [string, any]) => {
          const horarioObj = {
            dia,
            horario_inicio: horario.horario_inicio || horario.inicio,
            horario_fim: horario.horario_fim || horario.fim,
            intervalo_inicio: horario.intervalo_inicio,
            intervalo_fim: horario.intervalo_fim
          };
          
          // Log para debug
          console.log(`Horário para ${dia}:`, JSON.stringify(horarioObj, null, 2));
          
          return horarioObj;
        })
    };

    // Cadastrar agente na Xano
    const xanoResponse = await fetch(`${xanoEndpoint}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xanoApiKey}`
      },
      body: JSON.stringify(xanoData)
    });

    if (!xanoResponse.ok) {
      throw new Error('Erro ao cadastrar agente na Xano');
    }

    const agentData = await xanoResponse.json();
    console.log('Dados do agente retornados pela Xano:', agentData);

    if (!agentData.id) {
      throw new Error('ID do agente não retornado pela Xano');
    }

    // Garantir que o ID é um número
    const agentId = parseInt(agentData.id);
    if (isNaN(agentId)) {
      throw new Error('ID do agente inválido');
    }

    // Cadastrar horários na tabela agent_schedules
    if (xanoData.horarios.length > 0) {
      console.log('ID do agente validado:', agentId);
      const schedulePromises = xanoData.horarios.map(async (horario) => {
        // Criar objeto com agent_id primeiro para garantir que está no topo do objeto
        const scheduleData = {
          agents_id: agentId, // Corrigido o nome do campo para agents_id conforme esperado pela API
          dia: horario.dia,
          horario_inicio: horario.horario_inicio,
          horario_fim: horario.horario_fim,
          intervalo_inicio: horario.intervalo_inicio,
          intervalo_fim: horario.intervalo_fim
        };

        console.log('Estrutura final do scheduleData:', JSON.stringify(scheduleData, null, 2));

        // Validar a estrutura do objeto antes de enviar
        if (!scheduleData.agents_id || !scheduleData.dia) {
          console.error('Dados do horário inválidos:', scheduleData);
          throw new Error('Dados do horário inválidos');
        }

        const requestBody = JSON.stringify(scheduleData);
        console.log('Corpo da requisição:', requestBody);

        const scheduleResponse = await fetch(`${xanoEndpoint}/agent_schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${xanoApiKey}`
          },
          body: requestBody
        });

        console.log('Status da resposta:', scheduleResponse.status);
        
        const responseText = await scheduleResponse.text();
        console.log('Resposta do endpoint de schedules:', responseText);

        if (!scheduleResponse.ok) {
          console.error('Erro ao cadastrar horário:', responseText);
          throw new Error('Erro ao cadastrar horário do agente');
        }

        // Tenta fazer o parse do JSON apenas se houver conteúdo
        try {
          return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
          console.error('Erro ao fazer parse da resposta:', error);
          return null;
        }
      });

      try {
        await Promise.all(schedulePromises);
      } catch (error) {
        console.error('Erro ao cadastrar horários:', error);
        throw new Error('Erro ao cadastrar horários do agente');
      }
    }

    return NextResponse.json(agentData);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para aguardar um tempo específico
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para fazer requisição com retry em caso de limite de taxa
async function fetchWithRetry(url: string, options: RequestInit, retryCount = 3, retryDelay = 2000) {
  let lastError;
  
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      // Se não for a primeira tentativa, aguarda antes de tentar novamente
      if (attempt > 0) {
        console.log(`Tentativa ${attempt + 1} para ${url}. Aguardando ${retryDelay}ms...`);
        await sleep(retryDelay);
        // Aumenta o tempo de espera a cada tentativa
        retryDelay = retryDelay * 1.5;
      }
      
      const response = await fetch(url, options);
      
      // Se for erro de limite de taxa, tenta novamente
      if (response.status === 429) {
        const errorText = await response.text();
        console.error(`Limite de taxa atingido na tentativa ${attempt + 1}:`, errorText);
        lastError = new Error(`429 - ${errorText}`);
        continue; // Tenta novamente
      }
      
      return response; // Retorna a resposta se não for erro de limite de taxa
    } catch (error) {
      console.error(`Erro na tentativa ${attempt + 1}:`, error);
      lastError = error;
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  throw lastError || new Error('Falha após múltiplas tentativas');
}

export async function GET() {
  try {
    console.log('Buscando agentes da API do Xano...');
    // Buscar agentes com retry
    const agentsResponse = await fetchWithRetry(`${xanoEndpoint}/agents`, {
      headers: {
        'Authorization': `Bearer ${xanoApiKey}`
      }
    });

    if (!agentsResponse.ok) {
      const errorText = await agentsResponse.text();
      throw new Error(`Erro ao buscar agentes da Xano: ${agentsResponse.status} - ${errorText}`);
    }

    const agentsData = await agentsResponse.json();
    console.log('Dados brutos dos agentes:', agentsData);

    if (!Array.isArray(agentsData)) {
      console.error('Dados dos agentes não são um array:', agentsData);
      return NextResponse.json([]);
    }

    // Aguarda 2 segundos antes de buscar os horários para evitar limite de taxa
    console.log('Aguardando 2 segundos antes de buscar horários...');
    await sleep(2000);
    
    console.log('Buscando horários da API do Xano...');
    // Buscar horários com retry
    const schedulesResponse = await fetchWithRetry(`${xanoEndpoint}/agent_schedules`, {
      headers: {
        'Authorization': `Bearer ${xanoApiKey}`
      }
    });

    if (!schedulesResponse.ok) {
      const errorText = await schedulesResponse.text();
      throw new Error(`Erro ao buscar horários da Xano: ${schedulesResponse.status} - ${errorText}`);
    }

    const schedulesData = await schedulesResponse.json();
    console.log('Dados brutos dos horários:', schedulesData);

    // Transformar os dados para o formato esperado pelo frontend
    const formattedAgents = agentsData.map((agent: any) => {
      const agentSchedules = Array.isArray(schedulesData) 
        ? schedulesData.filter((schedule: any) => schedule.agents_id === agent.id)
        : [];

      const formattedAgent = {
        id: agent.id || '',
        nome: agent.nome || '',
        email: agent.email || '',
        freshchat_id: agent.freshchat_id || '',
        horarios: {},
        dias_trabalho: [],
        created_at: agent.created_at,
        updated_at: agent.updated_at
      };

      // Processar horários
      agentSchedules.forEach((schedule: any) => {
        if (schedule && schedule.dia) {
          // Converter timestamps para strings de horário no formato HH:MM
          const formatTimeFromTimestamp = (timestamp: number): string => {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
          };

          formattedAgent.horarios[schedule.dia] = {
            horario_inicio: formatTimeFromTimestamp(schedule.horario_inicio) || '',
            horario_fim: formatTimeFromTimestamp(schedule.horario_fim) || '',
            intervalo_inicio: formatTimeFromTimestamp(schedule.intervalo_inicio) || '',
            intervalo_fim: formatTimeFromTimestamp(schedule.intervalo_fim) || ''
          };
          
          // Adicionar o dia à lista de dias de trabalho se ainda não estiver lá
          if (!formattedAgent.dias_trabalho.includes(schedule.dia)) {
            formattedAgent.dias_trabalho.push(schedule.dia);
          }
        }
      });
      
      // Log para debug
      console.log('Horários formatados para o agente:', formattedAgent.id, JSON.stringify(formattedAgent.horarios, null, 2));

      return formattedAgent;
    });

    console.log('Agentes formatados:', formattedAgents);
    return NextResponse.json(formattedAgents);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}