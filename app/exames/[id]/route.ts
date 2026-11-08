import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Abre o PDF de um exame. As regras do banco decidem o acesso: se a pessoa não
// puder ver o exame, a consulta volta vazia e o link temporário não é gerado.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: exame } = await supabase
    .from("exames")
    .select("arquivo_path")
    .eq("id", id)
    .maybeSingle();

  if (!exame) return new NextResponse("Exame não encontrado.", { status: 404 });

  const { data: link } = await supabase.storage
    .from("exames")
    .createSignedUrl(exame.arquivo_path, 60);

  if (!link) return new NextResponse("Exame não encontrado.", { status: 404 });

  return NextResponse.redirect(link.signedUrl);
}
