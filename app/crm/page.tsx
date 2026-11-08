import type { Metadata } from "next";
import Link from "next/link";
import AreaTopo from "@/components/AreaTopo";
import StatusSelect from "@/components/crm/StatusSelect";
import { STATUS_CLIENTE } from "@/lib/constants";
import { exigirAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "CRM" };

const LIMITE = 100;

const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const dataBr = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "America/Manaus",
});

function linkFiltro(status?: string, busca?: string) {
  const params = new URLSearchParams();
  if (busca) params.set("q", busca);
  if (status) params.set("status", status);
  const consulta = params.toString();
  return consulta ? `/crm?${consulta}` : "/crm";
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { supabase, user } = await exigirAdmin();

  const parametros = await searchParams;
  const busca = parametros.q?.trim() ?? "";
  const status =
    parametros.status && Object.hasOwn(STATUS_CLIENTE, parametros.status)
      ? parametros.status
      : undefined;

  let consulta = supabase
    .from("clientes")
    .select("id, nome, email, telefone, especialidade, status, origem, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMITE);

  if (status) consulta = consulta.eq("status", status);

  if (busca) {
    // As aspas impedem que vírgulas e parênteses digitados virem parte do filtro.
    const termo = `"%${busca.replace(/[\\"]/g, "\\$&")}%"`;
    consulta = consulta.or(
      `nome.ilike.${termo},email.ilike.${termo},telefone.ilike.${termo}`,
    );
  }

  const [{ data: clientes, error }, { data: todos }] = await Promise.all([
    consulta,
    supabase.from("clientes").select("status"),
  ]);

  const contagem = (valor: string) =>
    todos?.filter((cliente) => cliente.status === valor).length ?? 0;

  const filtros = [
    { valor: undefined, rotulo: "Todos", total: todos?.length ?? 0 },
    ...Object.entries(STATUS_CLIENTE).map(([valor, rotulo]) => ({
      valor,
      rotulo,
      total: contagem(valor),
    })),
  ];

  return (
    <>
      <AreaTopo email={user.email} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clientes
          </h1>
          <Link
            href="/crm/clientes/novo"
            className={`rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover ${foco}`}
          >
            Novo cliente
          </Link>
        </div>

        <form method="get" action="/crm" className="mt-6 flex flex-col gap-3 sm:flex-row">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="flex-1">
            <label htmlFor="busca" className="sr-only">
              Buscar por nome, e-mail ou telefone
            </label>
            <input
              id="busca"
              name="q"
              type="search"
              defaultValue={busca}
              placeholder="Buscar por nome, e-mail ou telefone"
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

        <nav aria-label="Filtrar por status" className="mt-4 flex flex-wrap gap-2">
          {filtros.map((filtro) => {
            const ativo = filtro.valor === status;
            return (
              <Link
                key={filtro.rotulo}
                href={linkFiltro(filtro.valor, busca)}
                aria-current={ativo ? "page" : undefined}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${foco} ${
                  ativo
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-primary"
                }`}
              >
                {filtro.rotulo} ({filtro.total})
              </Link>
            );
          })}
        </nav>

        {error ? (
          <p role="alert" className="mt-8 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            Não foi possível carregar os clientes. Atualize a página para tentar de novo.
          </p>
        ) : !clientes?.length ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-600">
            {busca || status
              ? "Nenhum cliente encontrado com esses filtros."
              : "Nenhum cliente cadastrado ainda."}
          </p>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="mt-8 hidden grid-cols-[2fr_2fr_1fr_160px] gap-4 px-5 text-sm font-semibold text-slate-600 md:grid"
            >
              <span>Cliente</span>
              <span>Contato</span>
              <span>Entrada</span>
              <span>Status</span>
            </div>

            <ul className="mt-4 space-y-3 md:mt-2">
              {clientes.map((cliente) => (
                <li
                  key={cliente.id}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[2fr_2fr_1fr_160px] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-900">
                      <Link
                        href={`/crm/clientes/${cliente.id}`}
                        className={`rounded text-primary underline-offset-4 hover:underline ${foco}`}
                      >
                        {cliente.nome}
                      </Link>
                    </p>
                    <p className="text-sm text-slate-600">
                      {cliente.especialidade ?? "Sem especialidade"}
                    </p>
                  </div>
                  <div className="min-w-0 text-sm text-slate-700">
                    <p className="break-words">{cliente.email}</p>
                    <p>{cliente.telefone}</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    {dataBr.format(new Date(cliente.created_at))}
                    <span className="text-slate-600">
                      {cliente.origem === "site" ? " · site" : " · manual"}
                    </span>
                  </p>
                  <StatusSelect
                    key={cliente.status}
                    id={cliente.id}
                    nome={cliente.nome}
                    status={cliente.status}
                  />
                </li>
              ))}
            </ul>

            {clientes.length === LIMITE && (
              <p className="mt-4 text-sm text-slate-600">
                Mostrando os {LIMITE} mais recentes. Use a busca para encontrar outros.
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}
