"use client";

import { money } from "@/src/domain/pricing";

/**
 * Compara estimativa do Rapidin com o preço ajustado do Completão.
 */
export function RapidinComparison({
  rapidinPrice,
  completaoPrice,
}: {
  rapidinPrice: number;
  completaoPrice: number;
}) {
  const diff = completaoPrice - rapidinPrice;
  const abs = Math.abs(diff);
  const higher = diff > 0.05;
  const lower = diff < -0.05;

  return (
    <section className="surface rounded-[2rem] border-2 border-green-200 bg-white p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
        Comparação com o Rapidin
      </p>
      <h2 className="mt-2 text-2xl font-black">O que mudou depois da análise completa</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[#f7f4ee] p-5">
          <p className="text-xs font-black uppercase text-[var(--muted)]">🥾 No Rapidin</p>
          <p className="mt-2 text-3xl font-black">{money(rapidinPrice)}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Estimativa rápida</p>
        </div>
        <div className="rounded-2xl border border-[var(--green)] bg-[var(--green-soft)] p-5">
          <p className="text-xs font-black uppercase text-[var(--green)]">📋 No Completão</p>
          <p className="mt-2 text-3xl font-black text-[var(--green-deep)]">
            {money(completaoPrice)}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">Preço ajustado à sua realidade</p>
        </div>
      </div>

      <p className="mt-5 leading-7 text-[var(--muted)]">
        {higher && (
          <>
            Depois de olhar embalagem, tempo, taxas e outros custos, o preço recomendado subiu{" "}
            <strong>{money(abs)}</strong>. A estimativa rápida deixou algo de fora — e isso é
            normal.
          </>
        )}
        {lower && (
          <>
            Com mais detalhes, o preço ajustado ficou <strong>{money(abs)}</strong> abaixo da
            estimativa rápida. Você pode estar cobrindo melhor os custos reais ou recalibrando a
            margem.
          </>
        )}
        {!higher && !lower && (
          <>
            O preço ficou praticamente igual. Os detalhes confirmam que a estimativa do Rapidin já
            estava bem alinhada.
          </>
        )}
      </p>

      <ul className="mt-4 space-y-2 text-sm font-bold text-[var(--green-deep)]">
        <li>· Embalagens e utensílios entram com mais precisão</li>
        <li>· Tempo e perdas refletem o que realmente acontece</li>
        <li>· Taxas de venda e custos extras deixam de ser chute</li>
      </ul>
    </section>
  );
}
