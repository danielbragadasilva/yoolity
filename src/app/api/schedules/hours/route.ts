import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Calcular horas trabalhadas de um agente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Validações
    if (!agentId) {
      return NextResponse.json(
        { error: 'Parâmetro agent_id é obrigatório' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Parâmetros start_date e end_date são obrigatórios (formato: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validar formato das datas
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Verificar se o agente existe
    const { data: agent, error: agentError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agente não encontrado' },
        { status: 404 }
      );
    }

    // Calcular horas trabalhadas usando a função do Supabase
    const { data: hoursData, error } = await supabase
      .rpc('calculate_worked_hours', {
        p_agent_id: agentId,
        p_start_date: startDate,
        p_end_date: endDate
      });

    if (error) {
      console.error('Erro ao calcular horas trabalhadas:', error);
      return NextResponse.json(
        { error: 'Erro ao calcular horas trabalhadas', details: error.message },
        { status: 500 }
      );
    }

    // Buscar detalhes das escalas no período para contexto adicional
    const { data: scheduleDetails, error: scheduleError } = await supabase
      .from('schedules')
      .select(`
        id,
        start_time,
        end_time,
        shift_type,
        day_of_week,
        break_start_time,
        break_end_time,
        notes
      `)
      .eq('agent_id', agentId)
      .eq('is_active', true)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time');

    if (scheduleError) {
      console.error('Erro ao buscar detalhes das escalas:', scheduleError);
    }

    const result = hoursData?.[0] || {
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      break_hours: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        agent: {
          id: agent.id,
          email: agent.email,
          name: agent.raw_user_meta_data?.full_name || agent.email
        },
        period: {
          start_date: startDate,
          end_date: endDate
        },
        hours: {
          total_hours: parseFloat(result.total_hours) || 0,
          regular_hours: parseFloat(result.regular_hours) || 0,
          overtime_hours: parseFloat(result.overtime_hours) || 0,
          break_hours: parseFloat(result.break_hours) || 0
        },
        schedules: scheduleDetails || [],
        schedule_count: scheduleDetails?.length || 0
      }
    });

  } catch (error) {
    console.error('Erro na API de cálculo de horas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}