// src/utils/supabase/server.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  return createServerComponentClient({ cookies });
}
