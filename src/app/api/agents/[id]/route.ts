import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HorarioData {
  horario_inicio?: string;
  horario_fim?: string;
  inicio?: string;
  fim?: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Aguardar e extrair o ID do parâmetro de rota
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    const agentId = resolvedParams.id;
    
    // Processar o corpo da requisição
    const agent = await request.json();

    // Verificar se o agente existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 });
    }

    // Verificar se já existe outro agente com o mesmo email ou freshchat_id (exceto o atual)
    if (agent.email || agent.freshchat_id) {
      const duplicateAgent = await prisma.agent.findFirst({
        where: {
          AND: [
            { id: { not: agentId } },
            {
              OR: [
                ...(agent.email ? [{ email: agent.email }] : []),
                ...(agent.freshchat_id ? [{ freshchat_id: agent.freshchat_id }] : [])
              ]
            }
          ]
        }
      });

      if (duplicateAgent) {
        return NextResponse.json(
          { error: 'Já existe outro agente com este email ou Freshchat ID' },
          { status: 409 }
        );
      }
    }

    // Preparar dados dos horários se fornecidos
    let horariosData: any[] = [];
    if (agent.horarios && agent.dias_trabalho) {
      horariosData = (Object.entries(agent.horarios) as [string, HorarioData][])
        .filter(([dia]) => agent.dias_trabalho.includes(dia))
        .map(([dia, horario]) => ({
          dia,
          horario_inicio: horario.horario_inicio || horario.inicio || '',
          horario_fim: horario.horario_fim || horario.fim || '',
          intervalo_inicio: horario.intervalo_inicio || '',
          intervalo_fim: horario.intervalo_fim || ''
        }));
    }

    console.log('Atualizando agente:', {
      id: agentId,
      nome: agent.nome,
      email: agent.email,
      freshchat_id: agent.freshchat_id,
      horarios: horariosData
    });

    // Atualizar agente e horários em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar dados do agente
      const updatedAgent = await tx.agent.update({
        where: { id: agentId },
        data: {
          ...(agent.nome && { nome: agent.nome }),
          ...(agent.email && { email: agent.email }),
          ...(agent.freshchat_id && { freshchat_id: agent.freshchat_id }),
          ...(agent.avatar_url && { avatar_url: agent.avatar_url }),
          ...(agent.cargo && { cargo: agent.cargo }),
          ...(agent.turno && { turno: agent.turno }),
          updated_at: new Date()
        }
      });

      // Se horários foram fornecidos, atualizar os horários
      if (horariosData.length > 0) {
        // Deletar horários existentes
        await tx.agentSchedule.deleteMany({
          where: { agent_id: agentId }
        });

        // Criar novos horários
        await tx.agentSchedule.createMany({
          data: horariosData.map(horario => ({
            agent_id: agentId,
            ...horario
          }))
        });
      }

      return updatedAgent;
    });

    console.log('Agente atualizado com sucesso:', result);
    return NextResponse.json({ message: 'Agente atualizado com sucesso', agent: result });
  } catch (error) {
    console.error('Erro ao atualizar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Aguardar e extrair o ID do parâmetro de rota
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    const agentId = resolvedParams.id;

    // Verificar se o agente existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 });
    }

    // Deletar agente e seus horários em uma transação
    await prisma.$transaction(async (tx) => {
      // Deletar horários primeiro (devido à foreign key)
      await tx.agentSchedule.deleteMany({
        where: { agent_id: agentId }
      });

      // Deletar o agente
      await tx.agent.delete({
        where: { id: agentId }
      });
    });

    console.log('Agente deletado com sucesso:', agentId);
    return NextResponse.json({ message: 'Agente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar agente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Aguardar e extrair o ID do parâmetro de rota
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    const agentId = resolvedParams.id;

    // Buscar agente com seus horários
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        schedules: true
      }
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 });
    }

    // Formatar dados para o frontend
    const formattedAgent = {
      id: agent.id,
      nome: agent.nome,
      email: agent.email,
      freshchat_id: agent.freshchat_id,
      avatar_url: agent.avatar_url,
      cargo: agent.cargo,
      turno: agent.turno,
      status: agent.status,
      horarios: {} as Record<string, {
        horario_inicio?: string;
        horario_fim?: string;
        intervalo_inicio?: string;
        intervalo_fim?: string;
      }>,
      dias_trabalho: [] as string[],
      created_at: agent.created_at.toISOString(),
      updated_at: agent.updated_at.toISOString()
    };

    // Processar horários
    agent.schedules.forEach((schedule) => {
      if (schedule && schedule.dia) {
        formattedAgent.horarios[schedule.dia] = {
          horario_inicio: schedule.horario_inicio || '',
          horario_fim: schedule.horario_fim || '',
          intervalo_inicio: schedule.intervalo_inicio || '',
          intervalo_fim: schedule.intervalo_fim || ''
        };
        
        if (!formattedAgent.dias_trabalho.includes(schedule.dia)) {
          formattedAgent.dias_trabalho.push(schedule.dia);
        }
      }
    });

    return NextResponse.json(formattedAgent);
  } catch (error) {
    console.error('Erro ao buscar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}