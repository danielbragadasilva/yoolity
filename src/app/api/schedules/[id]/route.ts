import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Buscar escala específica por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const { data: schedule, error } = await supabase
      .from('schedules')
      .select(`
        *,
        agent:auth.users!schedules_agent_id_fkey(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Escala não encontrada' },
          { status: 404 }
        );
      }
      console.error('Erro ao buscar escala:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    console.error('Erro na API de escala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar escala específica
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Verificar se a escala existe
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
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
          p_exclude_schedule_id: id
        });

      if (conflictCheck) {
        return NextResponse.json(
          { error: 'Conflito de horário detectado' },
          { status: 409 }
        );
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    const allowedFields = [
      'start_time', 'end_time', 'shift_type', 'day_of_week',
      'is_active', 'is_recurring', 'break_start_time', 'break_end_time', 'notes'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Validar day_of_week se fornecido
    if (updateData.day_of_week !== undefined && (updateData.day_of_week < 0 || updateData.day_of_week > 6)) {
      return NextResponse.json(
        { error: 'day_of_week deve estar entre 0 (domingo) e 6 (sábado)' },
        { status: 400 }
      );
    }

    const { data: updatedSchedule, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        agent:auth.users!schedules_agent_id_fkey(
          id,
          email,
          raw_user_meta_data
        )
      `)
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

// DELETE - Remover escala específica
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Verificar se a escala existe
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há trocas pendentes para esta escala
    const { data: pendingSwaps } = await supabase
      .from('shift_swaps')
      .select('id')
      .or(`original_schedule_id.eq.${id},target_schedule_id.eq.${id}`)
      .eq('status', 'pending');

    if (pendingSwaps && pendingSwaps.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível remover escala com trocas pendentes' },
        { status: 409 }
      );
    }

    // Soft delete - marcar como inativa
    const { error } = await supabase
      .from('schedules')
      .update({ is_active: false })
      .eq('id', id);

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