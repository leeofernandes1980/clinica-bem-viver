import type { Metadata } from "next";
import Link from "next/link";
import AreaTopo from "@/components/AreaTopo";
import ClienteForm from "@/components/crm/ClienteForm";
import { exigirAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Novo cliente" };

export default async function NovoClientePage() {
  const { user } = await exigirAdmin();

  return (
    <>
      <AreaTopo email={user.email} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/crm"
          className="rounded text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← Voltar aos clientes
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Novo cliente
        </h1>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <ClienteForm />
        </div>
      </main>
    </>
  );
}
