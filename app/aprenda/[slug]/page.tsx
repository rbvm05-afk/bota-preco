import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GUIDE_ARTICLES, GUIDE_CATEGORIES } from "@/src/content/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Aprenda | Bota Preço" };
  return {
    title: `${article.title} | Bota Preço`,
    description: article.description,
    keywords: article.keywords,
  };
}

export default async function AprendaArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = GUIDE_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const category = GUIDE_CATEGORIES.find((c) => c.slug === article.category);

  return (
    <AppShell>
      <article className="animate-rise mx-auto max-w-2xl space-y-6">
        <header>
          {category && (
            <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
              {category.title}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">{article.title}</h1>
          <p className="mt-3 leading-7 text-[var(--muted)]">{article.description}</p>
        </header>

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <p className="font-bold text-[var(--muted)]">
            Este guia está em preparação. Em breve você encontra o passo a passo completo aqui.
          </p>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Enquanto isso, use o Rapidin para calcular o preço do seu produto com as mesmas ideias
            que vamos explicar nestes artigos.
          </p>
          <Link
            href="/rapidin"
            className="mt-6 inline-block rounded-2xl bg-[var(--green)] px-5 py-3 font-black text-white"
          >
            Calcular no Rapidin →
          </Link>
        </div>

        <Link href="/aprenda" className="font-black text-[var(--green)]">
          ← Voltar para Aprenda
        </Link>
      </article>
    </AppShell>
  );
}
