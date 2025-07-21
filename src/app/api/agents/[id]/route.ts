import { NextResponse } from 'next/server'

const xanoApiKey = process.env.XANO_API_KEY!;
const xanoEndpoint = process.env.XANO_ENDPOINT!;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Aguardar e extrair o ID do parâmetro de rota
    const resolvedParams = await params
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }
    
    const agentId = parseInt(resolvedParams.id)
    if (isNaN(agentId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    // Processar o corpo da requisição
    const agent = await request.json()

    // Atualiza os dados do agente
    console.log('Enviando dados para atualizar agente:', JSON.stringify({
      nome: agent.nome,
      email: agent.email,
      freshchat_id: agent.freshchat_id,
      avatar: agent.avatar,
      dias_trabalho: agent.dias_trabalho,
    }, null, 2))
    
    console.log('Endpoint da API:', `${xanoEndpoint}/agents/${agentId}`);
    
    const agentData = {
      nome: agent.nome,
      email: agent.email,
      freshchat_id: agent.freshchat_id,
      avatar: agent.avatar,
      dias_trabalho: agent.dias_trabalho,
    };
    
    const agentResponse = await fetch(`${xanoEndpoint}/agents/${agentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xanoApiKey}`
      },
      body: JSON.stringify(agentData),
    })

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text()
      console.error('Resposta de erro da API:', errorText)
      throw new Error(`Erro ao atualizar agente: ${agentResponse.status} - ${errorText}`)
    }

    // Busca os horários atuais do agente
    const schedulesResponse = await fetch(`${xanoEndpoint}/agent_schedules?agents_id=${agentId}`, {
      headers: {
        'Authorization': `Bearer ${xanoApiKey}`
      }
    })
    const currentSchedules = await schedulesResponse.json()

    // Deleta os horários existentes
    for (const schedule of currentSchedules) {
      await fetch(`${xanoEndpoint}/agent_schedules/${schedule.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${xanoApiKey}`
        }
      })
    }

    // Função para aguardar um tempo específico
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Função para converter strings de horário para timestamps
    const convertTimeToTimestamp = (timeStr: string | null | undefined): number | null => {
      if (!timeStr) return null;
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return null;
      
      const date = new Date();
      date.setUTCHours(hours, minutes, 0, 0);
      return date.getTime();
    };

    // Cria os novos horários com atraso entre as requisições para evitar limite de taxa
    for (let i = 0; i < agent.dias_trabalho.length; i++) {
      const dia = agent.dias_trabalho[i];
      const horario = agent.horarios[dia];
      
      if (horario) {
        // Adiciona um atraso de 2 segundos entre as requisições para evitar o limite de taxa do Xano
        if (i > 0) {
          console.log(`Aguardando 2 segundos antes de criar o horário para ${dia}...`);
          await sleep(2000); // Aguarda 2 segundos entre cada requisição
        }

        const scheduleData = {
          agents_id: agentId,
          dia: dia,
          horario_inicio: convertTimeToTimestamp(horario.horario_inicio || horario.inicio),
          horario_fim: convertTimeToTimestamp(horario.horario_fim || horario.fim),
          intervalo_inicio: convertTimeToTimestamp(horario.intervalo_inicio),
          intervalo_fim: convertTimeToTimestamp(horario.intervalo_fim),
        }
        
        // Log para debug
        console.log(`Criando horário para ${dia}:`, JSON.stringify(scheduleData, null, 2));

        try {
          const scheduleResponse = await fetch(`${xanoEndpoint}/agent_schedules`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${xanoApiKey}`
            },
            body: JSON.stringify(scheduleData),
          });

          if (!scheduleResponse.ok) {
            const errorText = await scheduleResponse.text();
            console.error(`Resposta de erro ao criar horário para ${dia}:`, errorText);
            
            // Se for erro de limite de taxa, aguarda mais tempo e tenta novamente
            if (scheduleResponse.status === 429) {
              console.log(`Limite de taxa atingido. Aguardando 5 segundos antes de tentar novamente...`);
              await sleep(5000); // Aguarda 5 segundos
              
              // Tenta novamente
              console.log(`Tentando novamente criar horário para ${dia}...`);
              const retryResponse = await fetch(`${xanoEndpoint}/agent_schedules`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${xanoApiKey}`
                },
                body: JSON.stringify(scheduleData),
              });
              
              if (!retryResponse.ok) {
                const retryErrorText = await retryResponse.text();
                console.error(`Falha na segunda tentativa para ${dia}:`, retryErrorText);
                throw new Error(`Erro ao criar horário para ${dia} após nova tentativa: ${retryResponse.status} - ${retryErrorText}`);
              } else {
                console.log(`Horário para ${dia} criado com sucesso após nova tentativa.`);
              }
            } else {
              // Se não for erro de limite de taxa, lança o erro normalmente
              throw new Error(`Erro ao criar horário para ${dia}: ${scheduleResponse.status} - ${errorText}`);
            }
          } else {
            console.log(`Horário para ${dia} criado com sucesso.`);
          }
        } catch (error) {
          console.error(`Erro ao processar horário para ${dia}:`, error);
          throw error;
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