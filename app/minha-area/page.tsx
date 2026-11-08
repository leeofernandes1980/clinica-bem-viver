import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AreaTopo from "@/components/AreaTopo";
import { CLINICA, STATUS_CONSULTA } from "@/lib/constants";
import { formatarData, formatarDataHora } from "@/lib/formatos";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Minha área" };

const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const cartao = "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6";
const tituloCartao = "text-lg font-bold text-slate-900";
const vazio = "mt-3 text-sm text-slate-600";

type Consulta = {
  id: string;
  especialidade: string;
  profissional: string;
  data_hora: string;
  status: string;
};

// Ignora maiúsculas e acentos: "nutricao" encontra "Nutrição".
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function separarConsultas(consultas: Consulta[]) {
  const agora = Date.now();
  const proxima = (consulta: Consulta) =>
    new Date(consulta.data_hora).getTime() > agora &&
    ["agendada", "confirmada"].includes(consulta.status);

  return {
    proximas: consultas
      .filter(proxima)
      .sort((a, b) => a.data_hora.localeCompare(b.data_hora)),
    anteriores: consultas
      .filter((consulta) => !proxima(consulta))
      .sort((a, b) => b.data_hora.localeCompare(a.data_hora)),
  };
}

function LinhaConsulta({ consulta }: { consulta: Consulta }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3">
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">
          {formatarDataHora(consulta.data_hora)}
        </p>
        <p className="break-words text-sm text-slate-700">
          {consulta.especialidade} · {consulta.profissional}
        </p>
      </div>
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
        {STATUS_CONSULTA[consulta.status as keyof typeof STATUS_CONSULTA]}
      </span>
    </li>
  );
}

export default async function MinhaAreaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: clienteId }, { data: nome }, { data: admin }] =
    await Promise.all([
      supabase.rpc("meu_cliente_id"),
      supabase.rpc("meu_nome"),
      supabase.rpc("e_admin"),
    ]);

  if (!clienteId) {
    return (
      <>
        <AreaTopo email={user.email} />
        <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Minha área
          </h1>
          {admin ? (
            <p className="mt-4 leading-relaxed text-slate-700">
              Esta conta é de administrador e não tem cadastro de cliente.{" "}
              <Link
                href="/crm"
                className={`rounded font-semibold text-primary underline underline-offset-4 ${foco}`}
              >
                Ir para o CRM
              </Link>
            </p>
          ) : (
            <p className="mt-4 leading-relaxed text-slate-700">
              Não encontramos um cadastro para o e-mail{" "}
              <strong className="break-words">{user.email}</strong>. Se você já
              é cliente, fale com a clínica para conferir o e-mail informado:{" "}
              <a
                href={CLINICA.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Falar pelo WhatsApp ${CLINICA.whatsapp.exibicao} (abre em nova aba)`}
                className={`whitespace-nowrap rounded font-semibold text-primary underline underline-offset-4 ${foco}`}
              >
                WhatsApp {CLINICA.whatsapp.exibicao}
              </a>
            </p>
          )}
        </main>
      </>
    );
  }

  // As regras do banco já limitam o retorno às consultas e aos exames publicados deste cliente.
  const [{ data: consultas }, { data: exames }] = await Promise.all([
    supabase
      .from("consultas")
      .select("id, especialidade, profissional, data_hora, status"),
    supabase
      .from("exames")
      .select("id, titulo, data_exame")
      .order("data_exame", { ascending: false }),
  ]);

  const { q } = await searchParams;
  const busca = normalizar(q?.trim() ?? "");
  const encontra = (...textos: string[]) =>
    !busca || normalizar(textos.join(" ")).includes(busca);

  const consultasFiltradas = (consultas ?? []).filter((consulta) =>
    encontra(
      consulta.especialidade,
      consulta.profissional,
      formatarDataHora(consulta.data_hora),
      STATUS_CONSULTA[consulta.status as keyof typeof STATUS_CONSULTA],
    ),
  );
  const examesFiltrados = (exames ?? []).filter((exame) =>
    encontra(exame.titulo, formatarData(exame.data_exame)),
  );
  const { proximas, anteriores } = separarConsultas(consultasFiltradas);

  return (
    <>
      <AreaTopo email={user.email} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900">
          Olá, {nome?.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-slate-700">
          Aqui estão suas consultas e seus resultados de exames.
        </p>

        <form method="get" action="/minha-area" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="busca" className="sr-only">
              Buscar por data, especialidade, profissional ou exame
            </label>
            <input
              id="busca"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Data, consulta ou exame"
              className={`block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 transition-colors duration-200 hover:border-primary ${foco}`}
            />
          </div>
          <button
            type="submit"
            className={`rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover ${foco}`}
          >
            Buscar
          </button>
        </form>

        {busca && (
          <p className="mt-3 text-sm">
            <Link
              href="/minha-area"
              className={`rounded font-semibold text-primary hover:underline ${foco}`}
            >
              Limpar busca
            </Link>
          </p>
        )}

        <div className="mt-6 space-y-6">
          <section aria-labelledby="titulo-proximas" className={cartao}>
            <h2 id="titulo-proximas" className={tituloCartao}>
              Próximas consultas
            </h2>
            {proximas.length ? (
              <ul className="mt-2 divide-y divide-slate-200">
                {proximas.map((consulta) => (
                  <LinhaConsulta key={consulta.id} consulta={consulta} />
                ))}
              </ul>
            ) : (
              <p className={vazio}>
                {busca ? "Nada encontrado nesta busca." : "Nenhuma consulta agendada."}
              </p>
            )}
          </section>

          <section aria-labelledby="titulo-exames" className={cartao}>
            <h2 id="titulo-exames" className={tituloCartao}>
              Resultados de exames
            </h2>
            {examesFiltrados.length ? (
              <ul className="mt-2 divide-y divide-slate-200">
                {examesFiltrados.map((exame) => (
                  <li
                    key={exame.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-900">
                        {exame.titulo}
                      </p>
                      <p className="text-sm text-slate-700">
                        {formatarData(exame.data_exame)}
                      </p>
                    </div>
                    <a
                      href={`/exames/${exame.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver PDF de ${exame.titulo} (abre em nova aba)`}
                      className={`rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-secondary ${foco}`}
                    >
                      Ver PDF
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={vazio}>
                {busca ? "Nada encontrado nesta busca." : "Nenhum resultado disponível ainda."}
              </p>
            )}
          </section>

          <section aria-labelledby="titulo-anteriores" className={cartao}>
            <h2 id="titulo-anteriores" className={tituloCartao}>
              Consultas anteriores
            </h2>
            {anteriores.length ? (
              <ul className="mt-2 divide-y divide-slate-200">
                {anteriores.map((consulta) => (
                  <LinhaConsulta key={consulta.id} consulta={consulta} />
                ))}
              </ul>
            ) : (
              <p className={vazio}>
                {busca ? "Nada encontrado nesta busca." : "Nenhuma consulta anterior."}
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
