import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForms from "@/components/LoginForms";
import { CLINICA } from "@/lib/constants";
import { createClient, destinoPosLogin } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesso à área do cliente e ao CRM da clínica.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(await destinoPosLogin(supabase));

  const { erro } = await searchParams;

  return (
    <main className="min-h-screen bg-secondary px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="rounded text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← Voltar ao site
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Entrar na {CLINICA.nome}
        </h1>

        {erro && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            Este link de acesso é inválido ou expirou. Peça um novo abaixo, no
            mesmo navegador em que for abrir o e-mail.
          </p>
        )}

        <div className="mt-8">
          <LoginForms />
        </div>
      </div>
    </main>
  );
}
