import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isPublicPath = ["/login", "/unauthorized"].includes(pathname);

  if (!session && !isPublicPath) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (session) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("permission_level")
      .eq("id", user?.id)
      .single();

    const userPermission = profile?.permission_level;

    const allowed = ["COORDENADOR", "QUALIDADE", "SUPERVISOR"];
    const isTryingToAccessMonitor = pathname === "/monitor";

    if (isTryingToAccessMonitor && !allowed.includes(userPermission)) {
      const unauthorizedUrl = req.nextUrl.clone();
      unauthorizedUrl.pathname = "/unauthorized";
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Se o usuário estiver logado e tentar acessar /login, redireciona para /control
    if (pathname === "/login") {
      const controlUrl = req.nextUrl.clone();
      controlUrl.pathname = "/control";
      return NextResponse.redirect(controlUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
