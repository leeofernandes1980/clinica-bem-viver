import Image from "next/image";
import { EQUIPE, EQUIPE_SECAO } from "@/lib/constants";

export default function Equipe() {
  return (
    <section id="equipe" className="bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {EQUIPE_SECAO.titulo}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {EQUIPE_SECAO.subtitulo}
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {EQUIPE.map((profissional) => (
            <li
              key={profissional.nome}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none"
            >
              <Image
                src={profissional.foto}
                alt={`Foto ilustrativa de ${profissional.nome}`}
                width={144}
                height={144}
                className="mx-auto h-36 w-36 rounded-full"
              />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {profissional.nome}
              </h3>
              <p className="mt-1 font-medium text-primary">
                {profissional.especialidade}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
