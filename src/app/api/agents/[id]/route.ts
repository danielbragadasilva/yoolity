import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const agent = await request.json()
    const agentId = parseInt(params.id)

    if (isNaN(agentId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Atualiza os dados do agente
    const agentResponse = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:3W0wl6HL/agents/${agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: agent.nome,
        email: agent.email,
        freshchat_id: agent.freshchat_id,
        avatar: agent.avatar,
        dias_trabalho: agent.dias_trabalho,
      }),
    })

    if (!agentResponse.ok) {
      throw new Error('Erro ao atualizar agente')
    }

    // Busca os horários atuais do agente
    const schedulesResponse = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:3W0wl6HL/agent_schedules?agents_id=${agentId}`)
    const currentSchedules = await schedulesResponse.json()

    // Deleta os horários existentes
    for (const schedule of currentSchedules) {
      await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:3W0wl6HL/agent_schedules/${schedule.id}`, {
        method: 'DELETE',
      })
    }

    // Cria os novos horários
    for (const dia of agent.dias_trabalho) {
      const horario = agent.horarios[dia]
      if (horario) {
        const scheduleData = {
          agents_id: agentId,
          dia: dia,
          horario_inicio: horario.inicio,
          horario_fim: horario.fim,
          intervalo_inicio: horario.intervalo_inicio,
          intervalo_fim: horario.intervalo_fim,
        }

        const scheduleResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:3W0wl6HL/agent_schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scheduleData),
        })

        if (!scheduleResponse.ok) {
          throw new Error(`Erro ao criar horário para ${dia}`)
        }
      }
    }

    return NextResponse.json({ message: 'Agente atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar agente:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar agente' },
      { status: 500 }
    )
  }
}