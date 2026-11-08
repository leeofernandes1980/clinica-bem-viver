import { COMO_FUNCIONA_SECAO, PASSOS } from "@/lib/constants";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {COMO_FUNCIONA_SECAO.titulo}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {COMO_FUNCIONA_SECAO.subtitulo}
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {PASSOS.map((passo, indice) => (
            <li key={passo.titulo} className="relative flex gap-4 md:block">
              {indice < PASSOS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -bottom-8 left-6 top-12 w-px bg-primary/40 md:bottom-auto md:left-12 md:-right-8 md:top-6 md:h-px md:w-auto"
                />
              )}

              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white"
              >
                {indice + 1}
              </span>

              <div className="md:mt-5 md:pr-6">
                <h3 className="pt-2.5 text-xl font-semibold text-slate-900 md:pt-0">
                  {passo.titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-700">
                  {passo.descricao}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
