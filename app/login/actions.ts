"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, destinoPosLogin } from "@/lib/supabase/server";

export type EstadoLogin = { erro?: string; enviado?: boolean };

export async function entrarComSenha(
  _estado: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("senha")),
  });

  if (error) return { erro: "E-mail ou senha incorretos." };

  redirect(await destinoPosLogin(supabase));
}

export async function enviarLink(
  _estado: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const origem = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: String(formData.get("email")),
    options: { emailRedirectTo: `${origem}/auth/callback` },
  });

  if (error) {
    return {
      erro: "Não foi possível enviar o link. Aguarde alguns minutos e tente novamente.",
    };
  }

  return { enviado: true };
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
