"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLINICA, NAV_LINKS } from "@/lib/constants";

const focoVisivel =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const botaoAgendar = `rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover ${focoVisivel}`;

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;

    const fecharComEsc = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAberto(false);
    };

    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [menuAberto]);

  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <a
          href="#inicio"
          onClick={fecharMenu}
          className={`flex items-center gap-2 rounded text-lg font-bold text-primary ${focoVisivel}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-current"
          >
            <path d="M12 21s-8.5-5.2-8.5-11.2A4.8 4.8 0 0 1 12 6.9a4.8 4.8 0 0 1 8.5 2.9C20.5 15.8 12 21 12 21Z" />
            <path d="M11 9.5h2V12h2.5v2H13v2.5h-2V14H8.5v-2H11Z" fill="#fff" />
          </svg>
          {CLINICA.nome}
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`rounded text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-primary ${focoVisivel}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={`hidden whitespace-nowrap rounded px-3 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover sm:inline-block ${focoVisivel}`}
          >
            Área do cliente
          </Link>

          <a
            href={CLINICA.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar consulta pelo WhatsApp (abre em nova aba)"
            className={`hidden sm:inline-block ${botaoAgendar}`}
          >
            Agendar
          </a>

          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            className={`rounded-lg p-2 text-slate-700 transition-colors duration-200 hover:bg-secondary hover:text-primary lg:hidden ${focoVisivel}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuAberto ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="menu-mobile"
        hidden={!menuAberto}
        className="border-t border-slate-200 bg-white lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={fecharMenu}
                className={`block rounded-lg px-3 py-2.5 font-medium text-slate-700 transition-colors duration-200 hover:bg-secondary hover:text-primary ${focoVisivel}`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="sm:hidden">
            <Link
              href="/login"
              onClick={fecharMenu}
              className={`block rounded-lg px-3 py-2.5 font-semibold text-primary transition-colors duration-200 hover:bg-secondary ${focoVisivel}`}
            >
              Área do cliente
            </Link>
          </li>
          <li className="mt-2 sm:hidden">
            <a
              href={CLINICA.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={fecharMenu}
              aria-label="Agendar consulta pelo WhatsApp (abre em nova aba)"
              className={`block ${botaoAgendar}`}
            >
              Agendar
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
