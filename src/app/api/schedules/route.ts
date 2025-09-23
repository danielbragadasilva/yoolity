import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Schedule {
  id?: string;
  agent_id: string;
  start_time: string;
  end_time: string;
  shift_type: 'manha' | 'tarde' | 'noite' | 'madrugada';
  day_of_week: number;
  is_active?: boolean;
  is_recurring?: boolean;
  break_start_time?: string;
  break_end_time?: string;
  notes?: string;
  created_by?: string;
}

interface ScheduleFilters {
  agent_id?: string;
  shift_type?: string;
  day_of_week?: number;
  week_start?: string;
  is_active?: boolean;
}

// GET - Listar escalas com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: ScheduleFilters = {
      agent_id: searchParams.get('agent_id') || undefined,
      shift_type: searchParams.get('shift_type') || undefined,
      day_of_week: searchParams.get('day_of_week') ? parseInt(searchParams.get('day_of_week')!) : undefined,
      week_start: searchParams.get('week_start') || undefined,
      is_active: searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined
    };

    let query = supabase
      .from('schedules')
      .select(`
        *,
        agent:auth.users!schedules_agent_id_fkey(
          id,
          email,
          raw_user_meta_data
        )
      `);

    // Aplicar filtros
    if (filters.agent_id) {
      query = query.eq('agent_id', filters.agent_id);
    }
    if (filters.shift_type) {
      query = query.eq('shift_type', filters.shift_type);
    }
    if (filters.day_of_week !== undefined) {
      query = query.eq('day_of_week', filters.day_of_week);
    }
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters.week_start) {
      const weekEnd = new Date(filters.week_start);
      weekEnd.setDate(weekEnd.getDate() + 6);
      query = query
        .gte('start_time', filters.week_start)
        .lte('start_time', weekEnd.toISOString());
    }

    query = query.order('start_time', { ascending: true });

    const { data: schedules, error } = await query;

    if (error) {
      console.error('Erro ao buscar escalas:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schedules,
      count: schedules?.length || 0
    });

  } catch (error) {
    console.error('Erro na API de escalas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova escala
export async function POST(request: NextRequest) {
  try {
    const body: Schedule = await request.json();

    // Validações básicas
    if (!body.agent_id || !body.start_time || !body.end_time || !body.shift_type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: agent_id, start_time, end_time, shift_type' },
        { status: 400 }
      );
    }

    if (body.day_of_week < 0 || body.day_of_week > 6) {
      return NextResponse.json(
        { error: 'day_of_week deve estar entre 0 (domingo) e 6 (sábado)' },
        { status: 400 }
      );
    }

    // Verificar conflitos de horário
    const { data: conflictCheck } = await supabase
      .rpc('check_schedule_conflict', {
        p_agent_id: body.agent_id,
        p_start_time: body.start_time,
        p_end_time: body.end_time
      });

    if (conflictCheck) {
      return NextResponse.json(
        { error: 'Conflito de horário detectado para este agente' },
        { status: 409 }
      );
    }

    // Criar escala
    const { data: newSchedule, error } = await supabase
      .from('schedules')
      .insert({
        agent_id: body.agent_id,
        start_time: body.start_time,
        end_time: body.end_time,
        shift_type: body.shift_type,
        day_of_week: body.day_of_week,
        is_active: body.is_active ?? true,
        is_recurring: body.is_recurring ?? true,
        break_start_time: body.break_start_time,
        break_end_time: body.break_end_time,
        notes: body.notes,
        created_by: body.created_by || body.agent_id
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar escala:', error);
      return NextResponse.json(
        { error: 'Erro ao criar escala', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newSchedule,
      message: 'Escala criada com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro na criação de escala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar escala existente
export async function PUT(request: NextRequest) {
  try {
    const body: Schedule & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID da escala é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a escala existe
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', body.id)
      .single();

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    // Verificar conflitos se horários foram alterados
    if (body.start_time || body.end_time) {
      const { data: conflictCheck } = await supabase
        .rpc('check_schedule_conflict', {
          p_agent_id: body.agent_id || existingSchedule.agent_id,
          p_start_time: body.start_time || existingSchedule.start_time,
          p_end_time: body.end_time || existingSchedule.end_time,
          p_exclude_schedule_id: body.id
        });

      if (conflictCheck) {
        return NextResponse.json(
          { error: 'Conflito de horário detectado' },
          { status: 409 }
        );
      }
    }

    // Atualizar escala
    const updateData: Partial<Schedule> = {};
    if (body.start_time) updateData.start_time = body.start_time;
    if (body.end_time) updateData.end_time = body.end_time;
    if (body.shift_type) updateData.shift_type = body.shift_type;
    if (body.day_of_week !== undefined) updateData.day_of_week = body.day_of_week;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.is_recurring !== undefined) updateData.is_recurring = body.is_recurring;
    if (body.break_start_time !== undefined) updateData.break_start_time = body.break_start_time;
    if (body.break_end_time !== undefined) updateData.break_end_time = body.break_end_time;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const { data: updatedSchedule, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar escala:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar escala', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSchedule,
      message: 'Escala atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro na atualização de escala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover escala
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'ID da escala é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a escala existe
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    // Remover escala (soft delete - marcar como inativa)
    const { error } = await supabase
      .from('schedules')
      .update({ is_active: false })
      .eq('id', scheduleId);

    if (error) {
      console.error('Erro ao remover escala:', error);
      return NextResponse.json(
        { error: 'Erro ao remover escala', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Escala removida com sucesso'
    });

  } catch (error) {
    console.error('Erro na remoção de escala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}