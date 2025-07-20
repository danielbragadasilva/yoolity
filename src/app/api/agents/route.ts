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
        .map(([dia, horario]: [string, any]) => ({
          dia,
          horario_inicio: horario.inicio,
          horario_fim: horario.fim,
          intervalo_inicio: horario.intervalo_inicio,
          intervalo_fim: horario.intervalo_fim
        }))
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

export async function GET() {
  try {
    // Buscar agentes
    const agentsResponse = await fetch(`${xanoEndpoint}/agents`, {
      headers: {
        'Authorization': `Bearer ${xanoApiKey}`
      }
    });

    if (!agentsResponse.ok) {
      throw new Error('Erro ao buscar agentes da Xano');
    }

    const agentsData = await agentsResponse.json();
    console.log('Dados brutos dos agentes:', agentsData);

    if (!Array.isArray(agentsData)) {
      console.error('Dados dos agentes não são um array:', agentsData);
      return NextResponse.json([]);
    }

    // Buscar horários
    const schedulesResponse = await fetch(`${xanoEndpoint}/agent_schedules`, {
      headers: {
        'Authorization': `Bearer ${xanoApiKey}`
      }
    });

    if (!schedulesResponse.ok) {
      throw new Error('Erro ao buscar horários da Xano');
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
      agentSchedules.forEach((schedule: WorkSchedule) => {
        if (schedule && schedule.dia) {
          formattedAgent.horarios[schedule.dia] = {
            inicio: schedule.horario_inicio || '',
            fim: schedule.horario_fim || '',
            intervalo_inicio: schedule.intervalo_inicio || '',
            intervalo_fim: schedule.intervalo_fim || ''
          };
          formattedAgent.dias_trabalho.push(schedule.dia);
        }
      });

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