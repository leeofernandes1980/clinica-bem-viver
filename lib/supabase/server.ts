import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Páginas não gravam cookies; o proxy renova a sessão nesses casos.
          }
        },
      },
    },
  );
}

export async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: admin } = await supabase.rpc("e_admin");
  if (!admin) redirect("/minha-area");

  return { supabase, user };
}

export async function destinoPosLogin(supabase: SupabaseClient) {
  const { data: admin } = await supabase.rpc("e_admin");
  return admin ? "/crm" : "/minha-area";
}
