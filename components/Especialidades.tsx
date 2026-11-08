import type { ReactNode } from "react";
import { ESPECIALIDADES, ESPECIALIDADES_SECAO } from "@/lib/constants";

type Icone = (typeof ESPECIALIDADES)[number]["icone"];

const ICONES: Record<Icone, ReactNode> = {
  estetoscopio: (
    <>
      <path d="M11 2v2" />
      <path d="M5 2v2" />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  maca: (
    <>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </>
  ),
  cerebro: (
    <>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    </>
  ),
  movimento: (
    <>
      <circle cx="12" cy="5" r="1" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </>
  ),
};

export default function Especialidades() {
  return (
    <section id="especialidades" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {ESPECIALIDADES_SECAO.titulo}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {ESPECIALIDADES_SECAO.subtitulo}
          </p>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ESPECIALIDADES.map((especialidade) => (
            <li
              key={especialidade.nome}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md motion-reduce:transform-none"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {ICONES[especialidade.icone]}
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {especialidade.nome}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-700">
                {especialidade.descricao}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
