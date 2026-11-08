import { DEPOIMENTOS, DEPOIMENTOS_SECAO } from "@/lib/constants";

const TOTAL_ESTRELAS = 5;

function Estrelas({ quantidade }: { quantidade: number }) {
  return (
    <div
      role="img"
      aria-label={`Avaliação: ${quantidade} de ${TOTAL_ESTRELAS} estrelas`}
      className="flex gap-0.5"
    >
      {Array.from({ length: TOTAL_ESTRELAS }, (_, indice) => (
        <svg
          key={indice}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-5 w-5 fill-current ${
            indice < quantidade ? "text-amber-500" : "text-slate-200"
          }`}
        >
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {DEPOIMENTOS_SECAO.titulo}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {DEPOIMENTOS_SECAO.subtitulo}
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {DEPOIMENTOS.map((depoimento) => (
            <li
              key={depoimento.nome}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none"
            >
              <figure className="flex h-full flex-col">
                <Estrelas quantidade={depoimento.estrelas} />
                <blockquote className="mt-4 flex-1 leading-relaxed text-slate-700">
                  “{depoimento.texto}”
                </blockquote>
                <figcaption className="mt-5 font-semibold text-slate-900">
                  {depoimento.nome}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-slate-600">{DEPOIMENTOS_SECAO.aviso}</p>
      </div>
    </section>
  );
}
