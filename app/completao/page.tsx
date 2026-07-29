import Link from "next/link";
import { AppShell } from "@/components/AppShell";

/**
 * Completão congelado no MVP.
 * Arquitetura (chapters, Calculation, parentId) permanece no código
 * para retomada futura — sem desenvolvimento ativo de UX.
 */
export default function CompletaoPage() {
  return (
    <AppShell compact>
      <section className="surface animate-rise rounded-[2rem] p-8 text-center sm:p-12">
        <p className="text-4xl" aria-hidden>
          🚧
        </p>
        <p className="mt-4 text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
          Em desenvolvimento
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-.03em] sm:text-4xl">Completão</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--muted)]">
          Estamos criando uma versão muito mais completa do Bota Preço. Ela fará uma análise
          detalhada do seu negócio, encontrará oportunidades de melhoria e entregará um diagnóstico
          personalizado.
        </p>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-[var(--muted)]">
          Queremos lançar essa experiência apenas quando ela realmente estiver pronta. Enquanto
          isso, o <strong>Rapidin</strong> continua evoluindo e já está disponível gratuitamente.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/rapidin"
            className="rounded-2xl bg-[var(--green)] px-6 py-4 font-black text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5"
          >
            ⚡ Usar o Rapidin agora
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 font-black transition hover:bg-[var(--green-soft)]"
          >
            ← Voltar ao início
          </Link>
        </div>
        <p className="mt-8 text-sm font-bold text-[var(--muted)]">Em breve</p>
      </section>
    </AppShell>
  );
}
