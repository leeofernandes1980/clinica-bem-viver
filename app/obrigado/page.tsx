import type { Metadata } from "next";
import Link from "next/link";
import { CLINICA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mensagem enviada",
  description: "Recebemos sua mensagem e retornaremos o contato em breve.",
  alternates: { canonical: "/obrigado" },
  robots: { index: false, follow: false },
};

const focoVisivel =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function ObrigadoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Mensagem enviada!
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">
          Obrigado pelo contato. A equipe da {CLINICA.nome} retornará em breve
          para confirmar o melhor horário.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={`inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover ${focoVisivel}`}
          >
            Voltar ao início
          </Link>
          <a
            href={CLINICA.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar pelo WhatsApp (abre em nova aba)"
            className={`inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3.5 font-semibold text-primary transition-colors duration-200 hover:bg-secondary ${focoVisivel}`}
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
