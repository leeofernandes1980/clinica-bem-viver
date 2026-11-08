import { NextResponse, type NextRequest } from "next/server";
import { createClient, destinoPosLogin } from "@/lib/supabase/server";

// Recebe o link enviado por e-mail e abre a sessão do cliente.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destino = await destinoPosLogin(supabase);
      return NextResponse.redirect(new URL(destino, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?erro=link", request.url));
}
