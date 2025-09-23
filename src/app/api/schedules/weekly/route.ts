import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Buscar escalas da semana
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('week_start');
    const agentId = searchParams.get('agent_id');

    if (!weekStart) {
      return NextResponse.json(
        { error: 'Parâmetro week_start é obrigatório (formato: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validar formato da data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(weekStart)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Usar a função do Supabase para buscar escalas da semana
    const { data: weeklySchedules, error } = await supabase
      .rpc('get_weekly_schedules', {
        p_week_start: weekStart,
        p_agent_id: agentId
      });

    if (error) {
      console.error('Erro ao buscar escalas da semana:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar escalas da semana', details: error.message },
        { status: 500 }
      );
    }

    // Organizar dados por dia da semana
    const schedulesByDay = {
      0: [], // Domingo
      1: [], // Segunda
      2: [], // Terça
      3: [], // Quarta
      4: [], // Quinta
      5: [], // Sexta
      6: []  // Sábado
    };

    weeklySchedules?.forEach((schedule: any) => {
      schedulesByDay[schedule.day_of_week as keyof typeof schedulesByDay].push(schedule);
    });

    return NextResponse.json({
      success: true,
      data: {
        week_start: weekStart,
        schedules: weeklySchedules,
        schedules_by_day: schedulesByDay,
        total_schedules: weeklySchedules?.length || 0
      }
    });

  } catch (error) {
    console.error('Erro na API de escalas semanais:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}