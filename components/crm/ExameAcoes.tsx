"use client";

import { useState, useTransition } from "react";
import { alterarPublicacao, excluirExame } from "@/app/crm/actions";
import { botaoSecundario, foco } from "./estilos";

export default function ExameAcoes({
  id,
  clienteId,
  titulo,
  publicado,
}: {
  id: string;
  clienteId: string;
  titulo: string;
  publicado: boolean;
}) {
  const [erro, setErro] = useState(false);
  const [salvando, iniciar] = useTransition();

  const executar = (acao: () => Promise<boolean>) => {
    setErro(false);
    iniciar(async () => {
      if (!(await acao())) setErro(true);
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`/exames/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver PDF de ${titulo} (abre em nova aba)`}
          className={botaoSecundario}
        >
          Ver PDF
        </a>
        <button
          type="button"
          disabled={salvando}
          onClick={() =>
            executar(() => alterarPublicacao(id, clienteId, !publicado))
          }
          aria-label={`${publicado ? "Despublicar" : "Publicar"} ${titulo}`}
          className={botaoSecundario}
        >
          {publicado ? "Despublicar" : "Publicar"}
        </button>
        <button
          type="button"
          disabled={salvando}
          onClick={() => {
            if (window.confirm(`Excluir o exame "${titulo}"? Esta ação não pode ser desfeita.`)) {
              executar(() => excluirExame(id, clienteId));
            }
          }}
          aria-label={`Excluir ${titulo}`}
          className={`rounded px-2 py-2 text-sm font-semibold text-red-800 hover:underline disabled:opacity-70 ${foco}`}
        >
          Excluir
        </button>
      </div>
      {erro && (
        <p role="alert" className="text-xs text-red-800">
          Não foi possível concluir a ação.
        </p>
      )}
    </div>
  );
}
