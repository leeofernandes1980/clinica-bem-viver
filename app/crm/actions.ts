"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { STATUS_CLIENTE, STATUS_CONSULTA } from "@/lib/constants";
import { dataHoraManausParaIso, formatarDataHora } from "@/lib/formatos";
import { createClient } from "@/lib/supabase/server";

export type EstadoForm = { erro?: string; ok?: boolean };

// Todas as ações dependem das regras do banco: sem permissão de administrador,
// nada é gravado e o retorno vem vazio ou com erro.

const atualizarTelas = (clienteId: string) => {
  revalidatePath("/crm");
  revalidatePath(`/crm/clientes/${clienteId}`);
};

const campo = (dados: FormData, nome: string) =>
  String(dados.get(nome) ?? "").trim();

const anotar = (
  supabase: SupabaseClient,
  clienteId: string,
  canal: string,
  descricao: string,
) =>
  supabase
    .from("interacoes")
    .insert({ cliente_id: clienteId, canal, descricao });

export async function atualizarStatus(
  id: string,
  status: string,
): Promise<boolean> {
  if (!Object.hasOwn(STATUS_CLIENTE, status)) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .update({ status })
    .eq("id", id)
    .select("id");

  if (error || !data?.length) return false;

  atualizarTelas(id);
  return true;
}

export async function adicionarInteracao(
  _estado: EstadoForm,
  dados: FormData,
): Promise<EstadoForm> {
  const clienteId = campo(dados, "cliente_id");
  const canal = campo(dados, "canal");
  const descricao = campo(dados, "descricao");

  if (!["nota", "telefone", "whatsapp", "email"].includes(canal) || !descricao) {
    return { erro: "Preencha a anotação." };
  }

  const supabase = await createClient();
  const { error } = await anotar(supabase, clienteId, canal, descricao);
  if (error) return { erro: "Não foi possível salvar a anotação." };

  atualizarTelas(clienteId);
  return { ok: true };
}

export async function registrarMensagem(
  clienteId: string,
  canal: "whatsapp" | "email",
  modelo: string,
): Promise<boolean> {
  const nomeCanal = canal === "whatsapp" ? "WhatsApp" : "e-mail";
  const supabase = await createClient();
  const { error } = await anotar(
    supabase,
    clienteId,
    canal,
    `Mensagem aberta no ${nomeCanal}: ${modelo}`,
  );

  if (error) return false;

  atualizarTelas(clienteId);
  return true;
}

function lerCliente(dados: FormData) {
  const nome = campo(dados, "nome");
  const email = campo(dados, "email").toLowerCase();
  const telefone = campo(dados, "telefone");
  const especialidade = campo(dados, "especialidade") || null;

  if (!nome || !telefone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return null;
  }

  return { nome, email, telefone, especialidade };
}

const erroDeCliente = (codigo: string) =>
  codigo === "23505"
    ? "Já existe um cliente com este e-mail."
    : "Não foi possível salvar. Confira os dados e tente novamente.";

export async function criarCliente(
  dados: FormData,
): Promise<{ erro?: string; id?: string }> {
  const cliente = lerCliente(dados);
  if (!cliente) return { erro: "Preencha nome, e-mail válido e telefone." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .insert({ ...cliente, origem: "manual" })
    .select("id")
    .single();

  if (error) return { erro: erroDeCliente(error.code) };

  await anotar(supabase, data.id, "nota", "Cliente cadastrado manualmente.");

  atualizarTelas(data.id);
  return { id: data.id };
}

export async function atualizarCliente(
  id: string,
  dados: FormData,
): Promise<{ erro?: string; ok?: boolean }> {
  const cliente = lerCliente(dados);
  if (!cliente) return { erro: "Preencha nome, e-mail válido e telefone." };

  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("clientes")
    .select("email")
    .eq("id", id)
    .maybeSingle();

  if (!atual) return { erro: "Cliente não encontrado." };

  const { error } = await supabase.from("clientes").update(cliente).eq("id", id);
  if (error) return { erro: erroDeCliente(error.code) };

  await anotar(
    supabase,
    id,
    "nota",
    atual.email === cliente.email
      ? "Dados do cliente alterados."
      : `Dados do cliente alterados. E-mail de acesso: de ${atual.email} para ${cliente.email}.`,
  );

  atualizarTelas(id);
  return { ok: true };
}

export async function remarcarConsulta(
  id: string,
  clienteId: string,
  dataLocal: string,
): Promise<boolean> {
  const dataHora = dataHoraManausParaIso(dataLocal);
  if (!dataHora) return false;

  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("consultas")
    .select("especialidade, data_hora")
    .eq("id", id)
    .maybeSingle();

  if (!atual) return false;

  // A nova data ainda não foi confirmada com o cliente, por isso volta para "agendada".
  const { error } = await supabase
    .from("consultas")
    .update({ data_hora: dataHora, status: "agendada" })
    .eq("id", id);

  if (error) return false;

  await anotar(
    supabase,
    clienteId,
    "nota",
    `Consulta de ${atual.especialidade} remarcada de ${formatarDataHora(atual.data_hora)} para ${formatarDataHora(dataHora)}.`,
  );

  atualizarTelas(clienteId);
  return true;
}

export async function criarConsulta(
  _estado: EstadoForm,
  dados: FormData,
): Promise<EstadoForm> {
  const clienteId = campo(dados, "cliente_id");
  const especialidade = campo(dados, "especialidade");
  const profissional = campo(dados, "profissional");
  const dataHora = dataHoraManausParaIso(campo(dados, "data_hora"));

  if (!especialidade || !profissional || !dataHora) {
    return { erro: "Preencha especialidade, profissional e data." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("consultas").insert({
    cliente_id: clienteId,
    especialidade,
    profissional,
    data_hora: dataHora,
  });

  if (error) return { erro: "Não foi possível salvar a consulta." };

  await supabase
    .from("clientes")
    .update({ status: "agendado" })
    .eq("id", clienteId)
    .in("status", ["novo", "em_contato"]);
  await anotar(supabase, clienteId, "nota", `Consulta de ${especialidade} agendada.`);

  atualizarTelas(clienteId);
  return { ok: true };
}

export async function atualizarConsulta(
  id: string,
  clienteId: string,
  status: string,
): Promise<boolean> {
  if (!Object.hasOwn(STATUS_CONSULTA, status)) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultas")
    .update({ status })
    .eq("id", id)
    .select("id");

  if (error || !data?.length) return false;

  atualizarTelas(clienteId);
  return true;
}

export async function registrarExame(exame: {
  clienteId: string;
  titulo: string;
  dataExame: string;
  caminho: string;
  publicado: boolean;
}): Promise<boolean> {
  if (!exame.caminho.startsWith(`${exame.clienteId}/`)) return false;

  const supabase = await createClient();
  const { error } = await supabase.from("exames").insert({
    cliente_id: exame.clienteId,
    titulo: exame.titulo,
    data_exame: exame.dataExame,
    arquivo_path: exame.caminho,
    publicado: exame.publicado,
  });

  if (error) return false;

  await anotar(
    supabase,
    exame.clienteId,
    "nota",
    `Exame enviado${exame.publicado ? " e publicado" : " como rascunho"}: ${exame.titulo}`,
  );

  atualizarTelas(exame.clienteId);
  return true;
}

export async function alterarPublicacao(
  id: string,
  clienteId: string,
  publicado: boolean,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exames")
    .update({ publicado })
    .eq("id", id)
    .select("titulo");

  if (error || !data?.length) return false;

  await anotar(
    supabase,
    clienteId,
    "nota",
    `Exame ${publicado ? "publicado para o cliente" : "retirado da área do cliente"}: ${data[0].titulo}`,
  );

  atualizarTelas(clienteId);
  return true;
}

export async function excluirExame(
  id: string,
  clienteId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exames")
    .delete()
    .eq("id", id)
    .select("titulo, arquivo_path");

  if (error || !data?.length) return false;

  await supabase.storage.from("exames").remove([data[0].arquivo_path]);
  await anotar(supabase, clienteId, "nota", `Exame excluído: ${data[0].titulo}`);

  atualizarTelas(clienteId);
  return true;
}
