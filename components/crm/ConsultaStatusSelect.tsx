"use client";

import { useState, useTransition } from "react";
import { atualizarConsulta } from "@/app/crm/actions";
import { STATUS_CONSULTA } from "@/lib/constants";

export default function ConsultaStatusSelect({
  id,
  clienteId,
  descricao,
  status,
}: {
  id: string;
  clienteId: string;
  descricao: string;
  status: string;
}) {
  const [atual, setAtual] = useState(status);
  const [erro, setErro] = useState(false);
  const [salvando, iniciar] = useTransition();

  const alterar = (novo: string) => {
    const anterior = atual;
    setAtual(novo);
    setErro(false);

    iniciar(async () => {
      if (!(await atualizarConsulta(id, clienteId, novo))) {
        setAtual(anterior);
        setErro(true);
      }
    });
  };

  return (
    <div>
      <select
        aria-label={`Status da consulta: ${descricao}`}
        value={atual}
        disabled={salvando}
        onChange={(evento) => alterar(evento.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-200 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
      >
        {Object.entries(STATUS_CONSULTA).map(([valor, nome]) => (
          <option key={valor} value={valor}>
            {nome}
          </option>
        ))}
      </select>
      {erro && (
        <p role="alert" className="mt-1 text-xs text-red-800">
          Não foi possível salvar.
        </p>
      )}
    </div>
  );
}
