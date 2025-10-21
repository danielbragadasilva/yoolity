// src/lib/fetchUserRole.ts
import { supabase } from "@/utils/supabaseClient";

export async function fetchUserRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", userId)
    .single() as { data: { role: string } | null; error: Error | null };

  if (error) {
    console.error("Erro ao buscar role:", error);
    return null;
  }

  return data?.role as "coordenador" | "supervisor" | "qualidade" | "agente";
}
