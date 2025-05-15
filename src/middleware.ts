import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Se o usuário não estiver autenticado e tentar acessar "/control", redireciona para "/login"
  if (!session && req.nextUrl.pathname === "/control") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// Configurar em quais caminhos o middleware será aplicado
export const config = {
  matcher: ["/control"],
};