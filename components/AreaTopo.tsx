import Link from "next/link";
import { sair } from "@/app/login/actions";
import { CLINICA } from "@/lib/constants";

const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function AreaTopo({ email }: { email?: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className={`rounded text-lg font-bold text-primary ${foco}`}>
          {CLINICA.nome}
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <span className="min-w-0 truncate text-sm text-slate-600">{email}</span>
          <form action={sair}>
            <button
              type="submit"
              className={`rounded-lg border-2 border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-secondary ${foco}`}
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
