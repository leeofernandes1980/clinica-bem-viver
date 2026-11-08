"use client";

import { useActionState } from "react";
import { enviarLink, entrarComSenha } from "@/app/login/actions";

const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const rotulo = "block text-sm font-semibold text-slate-900";
const campo = `mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 transition-colors duration-200 hover:border-primary ${foco}`;
const botao = `mt-5 w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 ${foco}`;
const cartao = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8";
const alerta =
  "mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800";

export default function LoginForms() {
  const [link, enviar, enviando] = useActionState(enviarLink, {});
  const [senha, entrar, entrando] = useActionState(entrarComSenha, {});

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form action={enviar} className={cartao}>
        <h2 className="text-xl font-bold text-slate-900">Sou cliente</h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          Consulte suas datas de atendimento e resultados de exames. Enviaremos
          um link de acesso para o seu e-mail.
        </p>

        <div className="mt-5">
          <label htmlFor="cliente-email" className={rotulo}>
            E-mail
          </label>
          <input
            id="cliente-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={campo}
          />
        </div>

        {link.erro && (
          <p role="alert" className={alerta}>
            {link.erro}
          </p>
        )}
        {link.enviado && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-primary/40 bg-secondary px-4 py-3 text-sm text-slate-900"
          >
            Link enviado! Abra o e-mail neste mesmo navegador para entrar.
          </p>
        )}

        <button type="submit" disabled={enviando} className={botao}>
          {enviando ? "Enviando..." : "Receber link de acesso"}
        </button>
      </form>

      <form action={entrar} className={cartao}>
        <h2 className="text-xl font-bold text-slate-900">Sou da equipe</h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          Acesso restrito ao CRM da clínica.
        </p>

        <div className="mt-5">
          <label htmlFor="equipe-email" className={rotulo}>
            E-mail
          </label>
          <input
            id="equipe-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className={campo}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="equipe-senha" className={rotulo}>
            Senha
          </label>
          <input
            id="equipe-senha"
            name="senha"
            type="password"
            required
            autoComplete="current-password"
            className={campo}
          />
        </div>

        {senha.erro && (
          <p role="alert" className={alerta}>
            {senha.erro}
          </p>
        )}

        <button type="submit" disabled={entrando} className={botao}>
          {entrando ? "Entrando..." : "Entrar no CRM"}
        </button>
      </form>
    </div>
  );
}
