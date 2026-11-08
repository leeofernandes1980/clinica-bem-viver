import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AreaTopo from "@/components/AreaTopo";
import ClienteForm from "@/components/crm/ClienteForm";
import ConsultaForm from "@/components/crm/ConsultaForm";
import ConsultaRemarcar from "@/components/crm/ConsultaRemarcar";
import ConsultaStatusSelect from "@/components/crm/ConsultaStatusSelect";
import ContatoCliente from "@/components/crm/ContatoCliente";
import ExameAcoes from "@/components/crm/ExameAcoes";
import ExameForm from "@/components/crm/ExameForm";
import InteracaoForm from "@/components/crm/InteracaoForm";
import StatusSelect from "@/components/crm/StatusSelect";
import { CANAIS_INTERACAO, CLINICA, SITE_URL } from "@/lib/constants";
import { formatarData, formatarDataHora, numeroWhatsapp } from "@/lib/formatos";
import { exigirAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Cliente" };

const cartao = "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6";
const tituloCartao = "text-lg font-bold text-slate-900";
const vazio = "text-sm text-slate-600";

type Consulta = { especialidade: string; data_hora: string; status: string };

function proximaConsulta(consultas: Consulta[]) {
  const agora = Date.now();
  return consultas
    .filter(
      (consulta) =>
        new Date(consulta.data_hora).getTime() > agora &&
        ["agendada", "confirmada"].includes(consulta.status),
    )
    .sort((a, b) => a.data_hora.localeCompare(b.data_hora))[0];
}

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, user } = await exigirAdmin();
  const { id } = await params;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nome, email, telefone, especialidade, status, origem")
    .eq("id", id)
    .maybeSingle();

  if (!cliente) notFound();

  const [{ data: consultas }, { data: exames }, { data: interacoes }] =
    await Promise.all([
      supabase
        .from("consultas")
        .select("id, especialidade, profissional, data_hora, status")
        .eq("cliente_id", id)
        .order("data_hora", { ascending: false }),
      supabase
        .from("exames")
        .select("id, titulo, data_exame, publicado")
        .eq("cliente_id", id)
        .order("data_exame", { ascending: false }),
      supabase
        .from("interacoes")
        .select("id, canal, descricao, created_at")
        .eq("cliente_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const primeiroNome = cliente.nome.split(" ")[0];
  const proxima = proximaConsulta(consultas ?? []);

  // A mensagem de exame não cita o tipo de exame: o conteúdo fica protegido pelo login.
  const modelos = [
    {
      rotulo: "Retorno de contato",
      texto: `Olá, ${primeiroNome}! Aqui é da ${CLINICA.nome}. Recebemos seu contato e gostaríamos de combinar o melhor horário para o seu atendimento.`,
    },
    ...(proxima
      ? [
          {
            rotulo: "Lembrete de consulta",
            texto: `Olá, ${primeiroNome}! Lembramos que sua consulta está marcada para ${formatarDataHora(proxima.data_hora)}. Você pode confirmar?`,
          },
        ]
      : []),
    ...(exames?.some((exame) => exame.publicado)
      ? [
          {
            rotulo: "Exame disponível",
            texto: `Olá, ${primeiroNome}! Seu resultado já está disponível na Área do cliente: ${SITE_URL}/login`,
          },
        ]
      : []),
  ];

  return (
    <>
      <AreaTopo email={user.email} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/crm"
          className="rounded text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← Voltar aos clientes
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900">
              {cliente.nome}
            </h1>
            <p className="mt-2 break-words text-slate-700">
              {cliente.email} · {cliente.telefone}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {cliente.especialidade ?? "Sem especialidade"} · origem:{" "}
              {cliente.origem === "site" ? "site" : "manual"}
            </p>
          </div>
          <div className="sm:w-48">
            <StatusSelect
              key={cliente.status}
              id={cliente.id}
              nome={cliente.nome}
              status={cliente.status}
            />
          </div>
        </div>

        <details className={`mt-6 ${cartao}`}>
          <summary className="cursor-pointer rounded font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Editar dados do cliente
          </summary>
          <div className="mt-4">
            <ClienteForm
              cliente={{
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                especialidade: cliente.especialidade,
              }}
            />
          </div>
        </details>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0 space-y-6">
            <section aria-labelledby="titulo-contato" className={cartao}>
              <h2 id="titulo-contato" className={`${tituloCartao} mb-4`}>
                Entrar em contato
              </h2>
              <ContatoCliente
                clienteId={cliente.id}
                email={cliente.email}
                whatsapp={numeroWhatsapp(cliente.telefone)}
                modelos={modelos}
              />
            </section>

            <section aria-labelledby="titulo-consultas" className={cartao}>
              <h2 id="titulo-consultas" className={tituloCartao}>
                Consultas
              </h2>
              {consultas?.length ? (
                <ul className="mt-4 divide-y divide-slate-200">
                  {consultas.map((consulta) => (
                    <li
                      key={consulta.id}
                      className="grid gap-2 py-3 sm:grid-cols-[1fr_150px] sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {formatarDataHora(consulta.data_hora)}
                        </p>
                        <p className="break-words text-sm text-slate-700">
                          {consulta.especialidade} · {consulta.profissional}
                        </p>
                      </div>
                      <ConsultaStatusSelect
                        key={consulta.status}
                        id={consulta.id}
                        clienteId={cliente.id}
                        descricao={`${consulta.especialidade} em ${formatarDataHora(consulta.data_hora)}`}
                        status={consulta.status}
                      />
                      <div className="sm:col-span-2">
                        <ConsultaRemarcar
                          id={consulta.id}
                          clienteId={cliente.id}
                          dataHora={consulta.data_hora}
                          descricao={`${consulta.especialidade} em ${formatarDataHora(consulta.data_hora)}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mt-3 ${vazio}`}>Nenhuma consulta cadastrada.</p>
              )}
              <div className="mt-5 border-t border-slate-200 pt-5">
                <ConsultaForm clienteId={cliente.id} />
              </div>
            </section>

            <section aria-labelledby="titulo-exames" className={cartao}>
              <h2 id="titulo-exames" className={tituloCartao}>
                Exames
              </h2>
              {exames?.length ? (
                <ul className="mt-4 divide-y divide-slate-200">
                  {exames.map((exame) => (
                    <li key={exame.id} className="space-y-2 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="min-w-0 break-words font-semibold text-slate-900">
                          {exame.titulo}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            exame.publicado
                              ? "bg-secondary text-primary"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {exame.publicado ? "Publicado" : "Rascunho"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">
                        {formatarData(exame.data_exame)}
                      </p>
                      <ExameAcoes
                        id={exame.id}
                        clienteId={cliente.id}
                        titulo={exame.titulo}
                        publicado={exame.publicado}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mt-3 ${vazio}`}>Nenhum exame enviado.</p>
              )}
              <div className="mt-5 border-t border-slate-200 pt-5">
                <ExameForm clienteId={cliente.id} />
              </div>
            </section>
          </div>

          <section aria-labelledby="titulo-historico" className={`min-w-0 ${cartao}`}>
            <h2 id="titulo-historico" className={`${tituloCartao} mb-4`}>
              Histórico
            </h2>
            <InteracaoForm clienteId={cliente.id} />
            {interacoes?.length ? (
              <ul className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
                {interacoes.map((interacao) => (
                  <li key={interacao.id} className="py-3">
                    <p className="text-xs font-semibold text-primary">
                      {CANAIS_INTERACAO[interacao.canal as keyof typeof CANAIS_INTERACAO]}{" "}
                      <span className="font-normal text-slate-600">
                        · {formatarDataHora(interacao.created_at)}
                      </span>
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">
                      {interacao.descricao}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-5 ${vazio}`}>Nenhuma interação registrada.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
