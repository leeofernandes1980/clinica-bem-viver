"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { registrarContato } from "@/app/actions";
import {
  CLINICA,
  ESPECIALIDADES,
  FORMSPREE_ENDPOINT,
  FORMULARIO_SECAO,
} from "@/lib/constants";

const focoVisivel =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const rotulo = "block text-sm font-semibold text-slate-900";

const campo = `mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 transition-colors duration-200 hover:border-primary ${focoVisivel}`;

export default function Formulario() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setEnviando(true);
    setErro(false);

    const dados = new FormData(evento.currentTarget);

    // O contato vai para o CRM e para o e-mail. Basta um dos dois funcionar para não perdê-lo.
    const envios = await Promise.allSettled([
      registrarContato(dados),
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: dados,
      }).then((resposta) => resposta.ok),
    ]);

    if (envios.some((envio) => envio.status === "fulfilled" && envio.value)) {
      router.push("/obrigado");
      return;
    }

    setErro(true);
    setEnviando(false);
  };

  return (
    <section id="contato" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {FORMULARIO_SECAO.titulo}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {FORMULARIO_SECAO.subtitulo}
          </p>
          <p className="mt-6 text-slate-700">
            Prefere falar agora?{" "}
            <a
              href={CLINICA.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Falar pelo WhatsApp ${CLINICA.whatsapp.exibicao} (abre em nova aba)`}
              className={`whitespace-nowrap rounded font-semibold text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary-hover ${focoVisivel}`}
            >
              WhatsApp {CLINICA.whatsapp.exibicao}
            </a>
          </p>
        </div>

        <form
          onSubmit={enviar}
          aria-label="Formulário de agendamento"
          className="rounded-2xl border border-slate-200 bg-secondary p-6 sm:p-8"
        >
          <input
            type="hidden"
            name="_subject"
            value={`Novo contato pelo site: ${CLINICA.nome}`}
          />

          {/* Campo invisível para pessoas: robôs o preenchem e o Formspree descarta o envio. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className={rotulo}>
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                autoComplete="name"
                maxLength={200}
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="email" className={rotulo}>
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="telefone" className={rotulo}>
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                autoComplete="tel"
                maxLength={30}
                placeholder="(92) 90000-0000"
                className={campo}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="especialidade" className={rotulo}>
                Especialidade
              </label>
              <select
                id="especialidade"
                name="especialidade"
                required
                defaultValue=""
                className={campo}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {ESPECIALIDADES.map((especialidade) => (
                  <option key={especialidade.nome} value={especialidade.nome}>
                    {especialidade.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mensagem" className={rotulo}>
                Mensagem <span className="font-normal">(opcional)</span>
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                maxLength={2000}
                className={campo}
              />
            </div>
          </div>

          {erro && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              Não foi possível enviar sua mensagem. Tente novamente ou fale
              conosco pelo WhatsApp {CLINICA.whatsapp.exibicao}.
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className={`mt-6 w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 ${focoVisivel}`}
          >
            {enviando ? "Enviando..." : "Enviar mensagem"}
          </button>

          <p className="mt-3 text-center text-sm text-slate-600">
            {FORMULARIO_SECAO.privacidade}
          </p>
        </form>
      </div>
    </section>
  );
}
