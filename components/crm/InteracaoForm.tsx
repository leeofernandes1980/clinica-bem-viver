"use client";

import { useActionState } from "react";
import { adicionarInteracao } from "@/app/crm/actions";
import { alerta, botao, campo, rotulo } from "./estilos";

export default function InteracaoForm({ clienteId }: { clienteId: string }) {
  const [estado, enviar, salvando] = useActionState(adicionarInteracao, {});

  return (
    <form action={enviar} className="space-y-3">
      <input type="hidden" name="cliente_id" value={clienteId} />

      <div>
        <label htmlFor="canal" className={rotulo}>
          Tipo
        </label>
        <select id="canal" name="canal" defaultValue="nota" className={campo}>
          <option value="nota">Anotação</option>
          <option value="telefone">Ligação</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">E-mail</option>
        </select>
      </div>

      <div>
        <label htmlFor="descricao" className={rotulo}>
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          required
          maxLength={5000}
          className={campo}
        />
      </div>

      {estado.erro && (
        <p role="alert" className={alerta}>
          {estado.erro}
        </p>
      )}

      <button type="submit" disabled={salvando} className={botao}>
        {salvando ? "Salvando..." : "Adicionar ao histórico"}
      </button>
    </form>
  );
}
