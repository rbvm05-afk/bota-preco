import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GUIDE_ARTICLES, GUIDE_CATEGORIES } from "@/src/content/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return GUIDE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = GUIDE_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Aprenda | Bota Preço" };
  return {
    title: `${cat.title} | Aprenda | Bota Preço`,
    description: cat.description,
  };
}

export default async function AprendaCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = GUIDE_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = GUIDE_ARTICLES.filter((a) => a.category === slug);

  return (
    <AppShell>
      <div className="animate-rise mx-auto max-w-3xl space-y-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
            Aprenda
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">{category.title}</h1>
          <p className="mt-3 max-w-lg leading-7 text-[var(--muted)]">{category.description}</p>
        </header>

        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/aprenda/${a.slug}`}
                className="block surface rounded-2xl p-5 transition hover:border-[var(--green)]"
              >
                <p className="font-black">{a.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{a.description}</p>
                {!a.published && (
                  <span className="mt-2 inline-block text-xs font-bold text-[var(--muted)]">
                    Em breve
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/aprenda" className="font-black text-[var(--green)]">
          ← Voltar para Aprenda
        </Link>
      </div>
    </AppShell>
  );
}
