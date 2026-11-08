"use client";

import { useState, useTransition, type FormEvent } from "react";
import { remarcarConsulta } from "@/app/crm/actions";
import { isoParaCampoManaus } from "@/lib/formatos";
import { alerta, botao, botaoSecundario, campo, foco, rotulo } from "./estilos";

export default function ConsultaRemarcar({
  id,
  clienteId,
  dataHora,
  descricao,
}: {
  id: string;
  clienteId: string;
  dataHora: string;
  descricao: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState(false);
  const [salvando, iniciar] = useTransition();

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const novaData = String(new FormData(evento.currentTarget).get("data_hora"));
    setErro(false);

    iniciar(async () => {
      if (await remarcarConsulta(id, clienteId, novaData)) setAberto(false);
      else setErro(true);
    });
  };

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label={`Remarcar consulta: ${descricao}`}
        className={`rounded text-sm font-semibold text-primary hover:underline ${foco}`}
      >
        Remarcar
      </button>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-2 rounded-lg bg-secondary p-3">
      <div>
        <label htmlFor={`remarcar-${id}`} className={rotulo}>
          Nova data e hora (horário de Manaus)
        </label>
        <input
          id={`remarcar-${id}`}
          name="data_hora"
          type="datetime-local"
          required
          defaultValue={isoParaCampoManaus(dataHora)}
          className={campo}
        />
      </div>
      <p className="text-xs text-slate-700">
        A consulta volta para o status &quot;Agendada&quot;.
      </p>
      {erro && (
        <p role="alert" className={alerta}>
          Não foi possível remarcar. Tente novamente.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={salvando} className={botao}>
          {salvando ? "Salvando..." : "Salvar nova data"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className={botaoSecundario}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
