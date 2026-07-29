import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GUIDE_ARTICLES, GUIDE_CATEGORIES } from "@/src/content/types";

export const metadata = {
  title: "Aprenda | Bota Preço",
  description:
    "Guias simples para calcular preço, custos e lucro — feitos para quem vende o que produz.",
};

export default function AprendaPage() {
  const published = GUIDE_ARTICLES.filter((a) => a.published);

  return (
    <AppShell>
      <div className="animate-rise mx-auto max-w-3xl space-y-8">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Aprenda</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
            Guias para precificar sem chute
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[var(--muted)] leading-7">
            Em breve: artigos claros sobre brigadeiro, marmita, mão de obra, embalagem e lucro.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          {GUIDE_CATEGORIES.map((cat) => (
            <div key={cat.slug} className="surface rounded-2xl p-5">
              <h2 className="font-black">{cat.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{cat.description}</p>
            </div>
          ))}
        </section>

        <section className="surface rounded-[2rem] p-6">
          <h2 className="text-xl font-black">Em preparação</h2>
          <ul className="mt-4 space-y-3">
            {(published.length ? published : GUIDE_ARTICLES).map((a) => (
              <li key={a.slug} className="border-b border-[var(--border)] pb-3 last:border-0">
                <p className="font-black">{a.title}</p>
                <p className="text-sm text-[var(--muted)]">{a.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center">
          <Link href="/rapidin" className="font-black text-[var(--green)]">
            Ou já calcule no Rapidin →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
