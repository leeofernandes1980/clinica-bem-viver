"use client";

import { useRef, useState, type FormEvent } from "react";
import { registrarExame } from "@/app/crm/actions";
import { createClient } from "@/lib/supabase/client";
import { alerta, botao, campo, rotulo } from "./estilos";

const TAMANHO_MAXIMO = 10 * 1024 * 1024;

export default function ExameForm({ clienteId }: { clienteId: string }) {
  const formulario = useRef<HTMLFormElement>(null);
  const [erro, setErro] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErro(undefined);

    const dados = new FormData(evento.currentTarget);
    const arquivo = dados.get("arquivo") as File;

    if (arquivo.type !== "application/pdf") {
      setErro("Envie um arquivo em PDF.");
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      setErro("O arquivo deve ter no máximo 10 MB.");
      return;
    }

    setEnviando(true);

    // O PDF vai direto para a área privada, sem passar pelo servidor do site,
    // que tem limite menor de tamanho. As regras do banco exigem administrador.
    const supabase = createClient();
    const caminho = `${clienteId}/${crypto.randomUUID()}.pdf`;
    const { error } = await supabase.storage
      .from("exames")
      .upload(caminho, arquivo, { contentType: "application/pdf" });

    const registrado =
      !error &&
      (await registrarExame({
        clienteId,
        titulo: String(dados.get("titulo")).trim(),
        dataExame: String(dados.get("data_exame")),
        caminho,
        publicado: dados.get("publicado") === "on",
      }));

    if (!registrado) {
      if (!error) await supabase.storage.from("exames").remove([caminho]);
      setErro("Não foi possível enviar o exame. Tente novamente.");
      setEnviando(false);
      return;
    }

    formulario.current?.reset();
    setEnviando(false);
  };

  return (
    <form ref={formulario} onSubmit={enviar} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="exame-titulo" className={rotulo}>
          Título
        </label>
        <input
          id="exame-titulo"
          name="titulo"
          required
          maxLength={200}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="exame-data" className={rotulo}>
          Data do exame
        </label>
        <input
          id="exame-data"
          name="data_exame"
          type="date"
          required
          className={campo}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="exame-arquivo" className={rotulo}>
          Arquivo PDF (até 10 MB)
        </label>
        <input
          id="exame-arquivo"
          name="arquivo"
          type="file"
          accept="application/pdf"
          required
          className={campo}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-900 sm:col-span-2">
        <input
          name="publicado"
          type="checkbox"
          className="h-4 w-4 accent-primary"
        />
        Publicar agora na área do cliente
      </label>

      {erro && (
        <p role="alert" className={`sm:col-span-2 ${alerta}`}>
          {erro}
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={enviando} className={botao}>
          {enviando ? "Enviando..." : "Enviar exame"}
        </button>
      </div>
    </form>
  );
}
