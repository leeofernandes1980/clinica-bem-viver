"use client";

import { useState } from "react";
import { registrarMensagem } from "@/app/crm/actions";
import { CLINICA } from "@/lib/constants";
import { alerta, botao, botaoSecundario, campo, rotulo } from "./estilos";

type Modelo = { rotulo: string; texto: string };

export default function ContatoCliente({
  clienteId,
  email,
  whatsapp,
  modelos,
}: {
  clienteId: string;
  email: string;
  whatsapp: string | null;
  modelos: Modelo[];
}) {
  const [modelo, setModelo] = useState(modelos[0]);
  const [texto, setTexto] = useState(modelos[0].texto);
  const mensagem = encodeURIComponent(texto);
  const assunto = encodeURIComponent(CLINICA.nome);

  const escolher = (nome: string) => {
    const escolhido = modelos.find((item) => item.rotulo === nome) ?? modelos[0];
    setModelo(escolhido);
    setTexto(escolhido.texto);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="modelo" className={rotulo}>
          Modelo de mensagem
        </label>
        <select
          id="modelo"
          value={modelo.rotulo}
          onChange={(evento) => escolher(evento.target.value)}
          className={campo}
        >
          {modelos.map((item) => (
            <option key={item.rotulo}>{item.rotulo}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensagem-contato" className={rotulo}>
          Mensagem
        </label>
        <textarea
          id="mensagem-contato"
          rows={5}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          className={campo}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}?text=${mensagem}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => registrarMensagem(clienteId, "whatsapp", modelo.rotulo)}
            aria-label="Abrir conversa no WhatsApp (abre em nova aba)"
            className={botao}
          >
            Abrir no WhatsApp
          </a>
        ) : (
          <p className={alerta}>Telefone inválido para WhatsApp.</p>
        )}
        <a
          href={`mailto:${email}?subject=${assunto}&body=${mensagem}`}
          onClick={() => registrarMensagem(clienteId, "email", modelo.rotulo)}
          className={botaoSecundario}
        >
          Escrever e-mail
        </a>
      </div>
    </div>
  );
}
