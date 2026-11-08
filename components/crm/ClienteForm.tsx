"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { atualizarCliente, criarCliente } from "@/app/crm/actions";
import { ESPECIALIDADES } from "@/lib/constants";
import { alerta, botao, campo, rotulo } from "./estilos";

type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string | null;
};

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const [erro, setErro] = useState<string>();
  const [salvo, setSalvo] = useState(false);
  const [salvando, iniciar] = useTransition();

  // Sem o envio automático do React, o formulário mantém o que foi digitado quando há erro.
  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    setErro(undefined);
    setSalvo(false);

    iniciar(async () => {
      if (cliente) {
        const resultado = await atualizarCliente(cliente.id, dados);
        setErro(resultado.erro);
        setSalvo(Boolean(resultado.ok));
        return;
      }

      const resultado = await criarCliente(dados);
      if (resultado.id) router.push(`/crm/clientes/${resultado.id}`);
      else setErro(resultado.erro);
    });
  };

  return (
    <form onSubmit={enviar} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="cliente-nome" className={rotulo}>
          Nome
        </label>
        <input
          id="cliente-nome"
          name="nome"
          required
          maxLength={200}
          defaultValue={cliente?.nome}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="cliente-email" className={rotulo}>
          E-mail
        </label>
        <input
          id="cliente-email"
          name="email"
          type="email"
          required
          defaultValue={cliente?.email}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="cliente-telefone" className={rotulo}>
          Telefone
        </label>
        <input
          id="cliente-telefone"
          name="telefone"
          type="tel"
          required
          maxLength={30}
          placeholder="(92) 90000-0000"
          defaultValue={cliente?.telefone}
          className={campo}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="cliente-especialidade" className={rotulo}>
          Especialidade de interesse (opcional)
        </label>
        <select
          id="cliente-especialidade"
          name="especialidade"
          defaultValue={cliente?.especialidade ?? ""}
          className={campo}
        >
          <option value="">Nenhuma</option>
          {ESPECIALIDADES.map((item) => (
            <option key={item.nome}>{item.nome}</option>
          ))}
        </select>
      </div>

      <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:col-span-2">
        {cliente
          ? "Atenção: o e-mail dá acesso à área do cliente. Se você alterá-lo, o endereço antigo perde o acesso às consultas e aos exames, e o novo passa a tê-lo."
          : "O e-mail dá acesso à área do cliente: quem entrar com ele verá as consultas e os exames publicados. Confira antes de salvar."}
      </p>

      {erro && (
        <p role="alert" className={`sm:col-span-2 ${alerta}`}>
          {erro}
        </p>
      )}
      {salvo && (
        <p role="status" className="text-sm font-semibold text-primary sm:col-span-2">
          Dados salvos.
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={salvando} className={botao}>
          {salvando
            ? "Salvando..."
            : cliente
              ? "Salvar alterações"
              : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
