import { CLINICA, ESPECIALIDADES, HERO } from "@/lib/constants";

const focoVisivel =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const botaoBase = `inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${focoVisivel}`;

export default function Hero() {
  return (
    <section id="inicio" className="bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="text-sm font-semibold text-primary">{HERO.selo}</p>

          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {CLINICA.slogan}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-700">
            {HERO.subtitulo}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={CLINICA.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Agendar consulta pelo WhatsApp (abre em nova aba)"
              className={`${botaoBase} bg-primary text-white hover:bg-primary-hover`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.4A8.5 8.5 0 1 1 21 11.5Z" />
              </svg>
              Agendar pelo WhatsApp
            </a>

            <a
              href="#especialidades"
              className={`${botaoBase} border-2 border-primary text-primary hover:bg-white`}
            >
              Ver Especialidades
            </a>
          </div>
        </div>

        <aside
          aria-label="Informações de atendimento"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Atendimento presencial
          </h2>

          <dl className="mt-5 space-y-5 text-slate-700">
            <div>
              <dt className="text-sm font-semibold text-primary">Horários</dt>
              {CLINICA.horarios.map((horario) => (
                <dd key={horario.dias} className="mt-1">
                  {horario.dias}: {horario.horas}
                </dd>
              ))}
            </div>

            <div>
              <dt className="text-sm font-semibold text-primary">Endereço</dt>
              <dd className="mt-1">
                {CLINICA.endereco.logradouro} – {CLINICA.endereco.bairro}
                <br />
                {CLINICA.endereco.cidade}-{CLINICA.endereco.estado}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-primary">
                Especialidades
              </dt>
              <dd className="mt-1">
                {ESPECIALIDADES.map((item) => item.nome).join(" · ")}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
