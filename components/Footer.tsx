import { CLINICA, REDES_SOCIAIS, RODAPE } from "@/lib/constants";

const link =
  "rounded transition-colors duration-200 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const tituloColuna = "font-semibold text-white";

export default function Footer() {
  return (
    <footer className="bg-primary text-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{CLINICA.nome}</p>
            <p className="mt-3 leading-relaxed">{CLINICA.slogan}</p>
          </div>

          <div>
            <h2 className={tituloColuna}>Endereço</h2>
            <address className="mt-3 not-italic leading-relaxed">
              {CLINICA.endereco.logradouro} – {CLINICA.endereco.bairro}
              <br />
              {CLINICA.endereco.cidade}-{CLINICA.endereco.estado}
            </address>
          </div>

          <div>
            <h2 className={tituloColuna}>Horário</h2>
            <ul className="mt-3 space-y-1">
              {CLINICA.horarios.map((horario) => (
                <li key={horario.dias}>
                  {horario.dias}: {horario.horas}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={tituloColuna}>Contato</h2>
            <p className="mt-3">
              <a
                href={CLINICA.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Falar pelo WhatsApp ${CLINICA.whatsapp.exibicao} (abre em nova aba)`}
                className={`whitespace-nowrap ${link}`}
              >
                WhatsApp {CLINICA.whatsapp.exibicao}
              </a>
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {REDES_SOCIAIS.map((rede) => (
                <li key={rede.nome}>
                  <a
                    href={rede.href}
                    aria-label={`${rede.nome} da ${CLINICA.nome} (perfil fictício)`}
                    className={link}
                  >
                    {rede.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-sm">
          <p>{RODAPE.aviso}</p>
          <p className="mt-1">
            © {new Date().getFullYear()} {CLINICA.nome}
          </p>
        </div>
      </div>
    </footer>
  );
}
