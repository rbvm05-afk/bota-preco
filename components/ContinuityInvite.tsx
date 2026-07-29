"use client";

import Link from "next/link";
import type { PricingInput } from "@/types/pricing";

/**
 * Completão congelado no MVP — convite vira teaser "Em breve".
 * Props mantidas para não quebrar a página de resultado.
 */
export function ContinuityInvite({
  input: _input,
  parentId: _parentId,
  rapidinHealthyPrice: _price,
}: {
  input: PricingInput;
  parentId?: string;
  rapidinHealthyPrice?: number;
}) {
  return (
    <section className="surface animate-rise rounded-[2rem] border border-[var(--border)] bg-[#f7f4ee] p-6 sm:p-8">
      <p className="text-2xl" aria-hidden>
        📋
      </p>
      <h2 className="mt-3 text-xl font-black tracking-[-.03em] sm:text-2xl">
        Completão — em desenvolvimento
      </h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">
        Estamos preparando uma análise ainda mais completa do seu negócio. Queremos lançar só quando
        estiver realmente pronta.
      </p>
      <p className="mt-2 leading-7 text-[var(--muted)]">
        Seu preço do Rapidin já vale — e é grátis. Continue usando e refinando com tranquilidade.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-black text-[var(--muted)]">
          Em breve
        </span>
        <Link
          href="/rapidin"
          className="rounded-2xl bg-[var(--green)] px-5 py-3 text-sm font-black text-white"
        >
          Novo Rapidin →
        </Link>
      </div>
    </section>
  );
}
