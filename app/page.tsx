import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { texts } from "@/data/texts";

export default function Home() {
  return (
    <AppShell>
      <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.12fr_0.88fr] lg:py-20">
        <div>
          <span className="inline-flex rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm font-black text-[var(--green)]">
            {texts.home.eyebrow}
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            {texts.home.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            {texts.home.description}
          </p>

          <div className="mt-9 grid max-w-2xl gap-4 sm:grid-cols-2">
            <Link
              href="/rapidin"
              className="rounded-3xl bg-[var(--green)] p-5 text-white shadow-sm transition hover:-translate-y-1 hover:bg-[var(--green-dark)]"
            >
              <strong className="block text-xl">{texts.home.rapidin}</strong>
              <span className="mt-2 block text-sm leading-6 text-white/80">
                {texts.home.rapidinHelp}
              </span>
            </Link>

            <Link
              href="/completin"
              className="rounded-3xl border-2 border-[var(--green)] bg-white p-5 text-[var(--green)] transition hover:-translate-y-1 hover:bg-[var(--green-soft)]"
            >
              <strong className="block text-xl">{texts.home.completin}</strong>
              <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">
                {texts.home.completinHelp}
              </span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rotate-2 rounded-[2.5rem] border border-[var(--border)] bg-white p-6 shadow-xl shadow-green-900/10 sm:p-8">
            <p className="font-black text-[var(--green)]">Uma conta completa olha para:</p>

            <div className="mt-6 space-y-3">
              {[
                ["01", "Ingredientes e materiais"],
                ["02", "Tempo para fazer"],
                ["03", "Embalagem"],
                ["04", "Outros gastos"],
                ["05", "Margem"],
              ].map(([number, label]) => (
                <div key={number} className="flex items-center gap-4 rounded-2xl bg-[#f7f5ef] p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-[var(--green-soft)] text-sm font-black text-[var(--green)]">
                    {number}
                  </span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff1c7] p-4 text-sm leading-6">
              <strong className="block">A ideia não é cobrar mais.</strong>
              É cobrar sabendo de onde o preço saiu.
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
