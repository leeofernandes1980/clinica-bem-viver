"use client";

import { useActionState } from "react";
import { criarConsulta } from "@/app/crm/actions";
import { EQUIPE, ESPECIALIDADES } from "@/lib/constants";
import { alerta, botao, campo, rotulo } from "./estilos";

export default function ConsultaForm({ clienteId }: { clienteId: string }) {
  const [estado, enviar, salvando] = useActionState(criarConsulta, {});

  return (
    <form action={enviar} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="cliente_id" value={clienteId} />

      <div>
        <label htmlFor="consulta-especialidade" className={rotulo}>
          Especialidade
        </label>
        <select
          id="consulta-especialidade"
          name="especialidade"
          required
          defaultValue=""
          className={campo}
        >
          <option value="" disabled>
            Selecione
          </option>
          {ESPECIALIDADES.map((item) => (
            <option key={item.nome}>{item.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="consulta-profissional" className={rotulo}>
          Profissional
        </label>
        <input
          id="consulta-profissional"
          name="profissional"
          required
          maxLength={200}
          list="lista-profissionais"
          className={campo}
        />
        <datalist id="lista-profissionais">
          {EQUIPE.map((pessoa) => (
            <option key={pessoa.nome} value={pessoa.nome} />
          ))}
        </datalist>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="consulta-data" className={rotulo}>
          Data e hora (horário de Manaus)
        </label>
        <input
          id="consulta-data"
          name="data_hora"
          type="datetime-local"
          required
          className={campo}
        />
      </div>

      {estado.erro && (
        <p role="alert" className={`sm:col-span-2 ${alerta}`}>
          {estado.erro}
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={salvando} className={botao}>
          {salvando ? "Salvando..." : "Agendar consulta"}
        </button>
      </div>
    </form>
  );
}
