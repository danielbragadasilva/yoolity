// app/api/track-agent-status/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const body = await request.json();

  const agents = body.agents;

  const { error } = await supabase.from("agent_status_history").insert(
    agents.map((agent: any) => ({
      agent_id: agent.id,
      agent_name: `${agent.first_name} ${agent.last_name}`,
      agent_email: agent.email,
      agent_status_id: agent.agent_status?.id || null,
      agent_status_name: agent.agent_status?.name || null,
      login_status: agent.login_status,
    }))
  );

  if (error) {
    console.error("Erro ao inserir no Supabase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Status registrado com sucesso" }, { status: 200 });
}
