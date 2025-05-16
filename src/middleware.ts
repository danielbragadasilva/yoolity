// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Permitir rotas públicas
  const publicRoutes = ["/login", "/unauthorized", "/debug"];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return res;
  }

  // Recupera o usuário
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("🟢 Middleware: Usuário", user?.email);
  if (!user) {
    console.log("🔴 Middleware: usuário não autenticado");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Recupera a role do Supabase
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = roleData?.role;
  console.log("🟡 Middleware: role =", role);

  // Se não encontrar role, redireciona
  if (!role) {
    console.log("🔴 Middleware: role não encontrada");
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Exemplo de proteção por role
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/control")) {
    const allowedRoles = ["coordenador", "supervisor", "qualidade", "agente"];
    if (!allowedRoles.includes(role)) {
      console.log("🔒 Middleware: acesso negado à /control para role:", role);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/control/:path*",
    "/challenge/:path*",
    "/escalas/:path*",
    "/wiki/:path*",
    "/freshchat/:path*",
  ],
};
