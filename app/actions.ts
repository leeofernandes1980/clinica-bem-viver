"use server";

import { createClient } from "@/lib/supabase/server";

const texto = (dados: FormData, campo: string) => {
  const valor = dados.get(campo);
  return typeof valor === "string" && valor.trim() ? valor : undefined;
};

export async function registrarContato(dados: FormData): Promise<boolean> {
  // Campo invisível preenchido indica robô: finge sucesso e não grava nada.
  if (texto(dados, "_gotcha")) return true;

  const supabase = await createClient();
  const { error } = await supabase.rpc("registrar_contato", {
    p_nome: texto(dados, "nome"),
    p_email: texto(dados, "email"),
    p_telefone: texto(dados, "telefone"),
    p_especialidade: texto(dados, "especialidade"),
    p_mensagem: texto(dados, "mensagem"),
  });

  return !error;
}
