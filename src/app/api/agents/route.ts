import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface HorarioData {
  horario_inicio?: string;
  horario_fim?: string;
  inicio?: string;
  fim?: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
}

interface FormattedAgent {
  id: string;
  nome: string;
  email: string;
  freshchat_id: string;
  horarios: Record<string, {
    horario_inicio?: string;
    horario_fim?: string;
    intervalo_inicio?: string;
    intervalo_fim?: string;
  }>;
  dias_trabalho: string[];
  created_at?: string;
  updated_at?: string;
}

export async function POST(request: Request) {
  try {
    console.log('Recebendo requisição POST para criar agente');
    const agent = await request.json();
    console.log('Dados do agente recebidos:', agent);

    // Validar dados obrigatórios
    if (!agent.nome || !agent.email || !agent.freshchat_id) {
      return NextResponse.json(
        { error: 'Nome, email e Freshchat ID são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe um agente com o mesmo email ou freshchat_id
    const { data: existingAgent, error: checkError } = await supabase
      .from('Agent')
      .select('id, email, freshchat_id')
      .or(`email.eq.${agent.email},freshchat_id.eq.${agent.freshchat_id}`)
      .single();

    if (existingAgent && !checkError) {
      return NextResponse.json(
        { error: 'Já existe um agente com este email ou Freshchat ID' },
        { status: 409 }
      );
    }

    // Preparar dados dos horários
    const horariosData = (Object.entries(agent.horarios) as [string, HorarioData][])
      .filter(([dia]) => agent.dias_trabalho.includes(dia))
      .map(([dia, horario]) => ({
        dia,
        horario_inicio: horario.horario_inicio || horario.inicio || '',
        horario_fim: horario.horario_fim || horario.fim || '',
        intervalo_inicio: horario.intervalo_inicio || '',
        intervalo_fim: horario.intervalo_fim || ''
      }));

    // Criar o agente
    const { data: newAgent, error: agentError } = await supabase
      .from('Agent')
      .insert({
        nome: agent.nome,
        email: agent.email,
        freshchat_id: agent.freshchat_id,
        avatar_url: agent.avatar_url || null,
        cargo: agent.cargo || null,
        turno: agent.turno || null,
        status: 'ativo'
      })
      .select()
      .single();

    if (agentError) {
      console.error('Erro ao criar agente:', agentError);
      return NextResponse.json(
        { error: 'Erro ao criar agente: ' + agentError.message },
        { status: 500 }
      );
    }

    // Criar os horários se existirem
    if (horariosData.length > 0) {
      const { error: scheduleError } = await supabase
        .from('AgentSchedule')
        .insert(
          horariosData.map(horario => ({
            agent_id: newAgent.id,
            ...horario
          }))
        );

      if (scheduleError) {
        console.error('Erro ao criar horários:', scheduleError);
        // Não falhar a criação do agente por causa dos horários
      }
    }

    const result = newAgent;

    console.log('Agente criado com sucesso:', result);
    return NextResponse.json(result);
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
    console.log('Buscando agentes do Supabase...');
    
    // Buscar agentes
    const { data: agents, error: agentsError } = await supabase
      .from('Agent')
      .select('*')
      .order('created_at', { ascending: false });

    if (agentsError) {
      console.error('Erro ao buscar agentes:', agentsError);
      return NextResponse.json(
        { error: 'Erro ao buscar agentes: ' + agentsError.message },
        { status: 500 }
      );
    }

    console.log('Dados brutos dos agentes:', agents);

    // Buscar horários para todos os agentes
    const { data: schedules, error: schedulesError } = await supabase
      .from('AgentSchedule')
      .select('*');

    if (schedulesError) {
      console.error('Erro ao buscar horários:', schedulesError);
      // Continuar sem os horários se houver erro
    }

    // Transformar os dados para o formato esperado pelo frontend
    const formattedAgents: FormattedAgent[] = agents.map((agent) => {
      const formattedAgent: FormattedAgent = {
        id: agent.id,
        nome: agent.nome,
        email: agent.email,
        freshchat_id: agent.freshchat_id,
        horarios: {},
        dias_trabalho: [],
        created_at: agent.created_at,
        updated_at: agent.updated_at
      };

      // Processar horários se existirem
      if (schedules) {
        const agentSchedules = schedules.filter(schedule => schedule.agent_id === agent.id);
        
        agentSchedules.forEach((schedule) => {
          if (schedule && schedule.dia) {
            (formattedAgent.horarios as Record<string, {
              horario_inicio?: string;
              horario_fim?: string;
              intervalo_inicio?: string;
              intervalo_fim?: string;
            }>)[schedule.dia] = {
              horario_inicio: schedule.horario_inicio || '',
              horario_fim: schedule.horario_fim || '',
              intervalo_inicio: schedule.intervalo_inicio || '',
              intervalo_fim: schedule.intervalo_fim || ''
            };
            
            // Adicionar o dia à lista de dias de trabalho se ainda não estiver lá
            if (!formattedAgent.dias_trabalho.includes(schedule.dia)) {
              formattedAgent.dias_trabalho.push(schedule.dia);
            }
          }
        });
      }
      
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
  } finally {
    await prisma.$disconnect();
  }
}