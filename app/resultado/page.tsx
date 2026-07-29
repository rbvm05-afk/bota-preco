"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdSlot } from "@/components/AdSlot";
import { PriceSimulator } from "@/components/PriceSimulator";
import { calculatePrice, money } from "@/src/domain/pricing";
import { buildSmartPricingReport } from "@/src/domain/insights";
import type { PricingInput, PricingResult } from "@/types/pricing";

type CurrentSession = {
  id: string;
  mode: string;
  input: PricingInput;
  result?: PricingResult;
};

export default function ResultadoPage() {
  const [current, setCurrent] = useState<(CurrentSession & { result: PricingResult }) | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bota-preco-current");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CurrentSession;
      setCurrent({
        ...parsed,
        result: calculatePrice(parsed.input),
      });
    } catch {
      setCurrent(null);
    }
  }, []);

  const report = useMemo(() => {
    if (!current) return null;
    return buildSmartPricingReport(current.input, current.result);
  }, [current]);

  if (!current || !report) {
    return (
      <AppShell compact>
        <div className="surface rounded-[2rem] p-8 text-center">
          <h1 className="text-3xl font-black">Ainda não temos um cálculo aberto.</h1>
          <Link href="/" className="mt-6 inline-block font-black text-[var(--green)]">
            Começar agora →
          </Link>
        </div>
      </AppShell>
    );
  }

  const { input, result } = current;
  const { explanation, diagnosis, confidence, insights } = report;
  const fee =
    input.hasSalesFee === false ? 0 : (input.salesFeePercent ?? 0) / 100;
  const profitPerUnit = result.healthyPrice * (1 - fee) - result.costPerUnit;
  const hours = Math.max(0.01, input.workHours || 0.01);
  const units = Math.max(1, result.sellableUnits || input.yieldAmount || 1);
  const profitPerHour = (profitPerUnit * units) / hours;

  const signalTone: "red" | "yellow" | "green" =
    diagnosis.tone === "red" || diagnosis.tone === "orange"
      ? "red"
      : diagnosis.tone === "yellow"
        ? "yellow"
        : "green";

  const signalCopy = {
    red: {
      emoji: "🔴",
      title: "Está perdendo dinheiro",
      hint: "O preço atual (ou o mínimo) ainda não cobre o custo de verdade.",
    },
    yellow: {
      emoji: "🟡",
      title: "Está cobrindo os custos",
      hint: "Cobre o básico, mas sobra pouco para crescer e respirar.",
    },
    green: {
      emoji: "🟢",
      title: "Preço saudável",
      hint: "Cobre custos, valoriza seu tempo e deixa margem para seguir.",
    },
  }[signalTone];

  const confClass =
    confidence.level === "high"
      ? "bg-[var(--green-soft)] text-[var(--green)]"
      : confidence.level === "medium"
        ? "bg-[#fff8df] text-[#8a6a00]"
        : "bg-[#fff1ef] text-[var(--red)]";

  return (
    <AppShell compact>
      <section className="animate-rise space-y-5">
        {/* Sinaleiro */}
        <div className="relative overflow-hidden rounded-[2.3rem] bg-[var(--green-deep)] p-7 text-white shadow-2xl shadow-green-950/20 sm:p-10">
          <div className="absolute -right-12 -top-16 size-48 rounded-full border-[28px] border-white/5" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.15em]">
              Seu preço
            </span>
            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${confClass}`}>
              {confidence.label}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-5xl sm:text-6xl" aria-hidden>
              {signalCopy.emoji}
            </span>
            <div>
              <p className="text-lg font-black sm:text-xl">{signalCopy.title}</p>
              <p className="mt-1 text-sm text-white/75">{signalCopy.hint}</p>
            </div>
          </div>

          <p className="mt-6 font-bold text-white/70">
            Para sua {input.productName}, o Bota recomenda:
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-[-.05em] sm:text-6xl">
            {money(result.healthyPrice)}
          </h1>
          <p className="mt-3 text-white/80">
            Lucro estimado: <strong>{money(profitPerUnit)}</strong> por unidade ·{" "}
            <strong>{money(profitPerHour)}</strong>/hora
          </p>

          {input.hasCompetitorRef && input.competitorPrice != null && input.competitorPrice > 0 && (
            <p className="mt-3 text-sm text-white/65">
              Concorrência (referência): {money(input.competitorPrice)} — não entra no cálculo.
            </p>
          )}
        </div>

        {/* Faixas do sinaleiro */}
        <div className="grid gap-3 sm:grid-cols-3">
          <SignalCard
            emoji="🔴"
            label="Prejuízo"
            value={result.costPerUnit}
            text="Abaixo disso você perde dinheiro."
            active={signalTone === "red"}
          />
          <SignalCard
            emoji="🟡"
            label="Mínimo"
            value={result.minimumPrice}
            text="Cobre o custo com folga pequena."
            active={signalTone === "yellow"}
          />
          <SignalCard
            emoji="🟢"
            label="Saudável"
            value={result.healthyPrice}
            text="Referência recomendada pelo Bota."
            active={signalTone === "green"}
          />
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
          <p className="text-lg font-black">
            {diagnosis.emoji} {diagnosis.title}
          </p>
          <p className="mt-2 leading-6 text-[var(--muted)]">{diagnosis.message}</p>
        </div>

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
            Por que este preço?
          </p>
          <h2 className="mt-2 text-2xl font-black">Tudo explicado, sem mistério</h2>

          <div className="mt-6 space-y-0 divide-y divide-[var(--border)] font-mono text-sm sm:text-base">
            <ExplainRow label="Ingredientes" value={explanation.perUnit.materials} />
            {explanation.perUnit.waste > 0.005 && (
              <ExplainRow label="Perdas / desperdício" value={explanation.perUnit.waste} />
            )}
            <ExplainRow label="Embalagem" value={explanation.perUnit.packaging} />
            <ExplainRow label="Mão de obra" value={explanation.perUnit.labor} />
            <ExplainRow label="Outros custos" value={explanation.perUnit.extras} />
            <ExplainRow label="Seu custo total" value={explanation.perUnit.costTotal} strong />
          </div>

          <p className="mt-5 leading-7 text-[var(--muted)]">
            Aplicando margem de <strong>{explanation.marginPercent}%</strong>
            {explanation.feePercent > 0 ? ` e taxa de ${explanation.feePercent}%` : ""}, o preço
            recomendado fica em{" "}
            <strong className="text-[var(--green-deep)]">{money(explanation.recommendedPrice)}</strong>{" "}
            por unidade.
          </p>
        </div>

        {/* Accordion Entenda estes valores */}
        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setExplainOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 text-left"
            aria-expanded={explainOpen}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
                Entenda estes valores
              </p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">O que cada número significa</h2>
            </div>
            <span className="text-2xl font-black text-[var(--muted)]">{explainOpen ? "−" : "+"}</span>
          </button>

          {explainOpen && (
            <dl className="mt-6 space-y-4 border-t border-[var(--border)] pt-6">
              <ExplainItem
                term="Prejuízo"
                def={`Qualquer preço abaixo de ${money(result.costPerUnit)} não cobre o que você gastou para produzir.`} 
              />
              <ExplainItem
                term="Preço mínimo"
                def={`Por volta de ${money(result.minimumPrice)}: cobre o custo com uma folga pequena. Ainda é apertado.`} 
              />
              <ExplainItem
                term="Preço recomendado"
                def={`O Bota sugere ${money(result.healthyPrice)} — cobre custos, seu tempo e deixa margem para continuar.`} 
              />
              <ExplainItem
                term="Preço confortável"
                def={`Acima de ${money(result.premiumPrice)}: se o mercado pagar, sobra mais para reinvestir ou descansar.`} 
              />
              <ExplainItem
                term="Lucro"
                def={`O que sobra depois de pagar tudo (materiais, tempo, embalagem, taxas). Não é o valor que entra no caixa.`} 
              />
              <ExplainItem
                term="Custo por unidade"
                def={`${money(result.costPerUnit)} — quanto cada unidade custou para ficar pronta para vender.`} 
              />
              <ExplainItem
                term="Lucro vs faturamento"
                def="Faturamento é o que o cliente paga. Lucro é o que sobra depois de todos os custos. Os dois números são diferentes."
              />
            </dl>
          )}
        </div>

        <PriceSimulator input={input} result={result} />

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Insights</p>
          <h2 className="mt-2 text-2xl font-black">O que o Bota percebeu</h2>
          <ul className="mt-5 space-y-3">
            {insights.map((item) => (
              <li
                key={item.id}
                className={`rounded-2xl border p-4 ${
                  item.severity === "critical"
                    ? "border-[#efb6ad] bg-[#fff1ef]"
                    : item.severity === "warn"
                      ? "border-[#ecd28c] bg-[#fff8df]"
                      : "border-[var(--border)] bg-white"
                }`}
              >
                <strong className="block text-sm font-black">{item.title}</strong>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <strong className="font-black">{confidence.label}</strong>
            <span className="text-sm font-bold text-[var(--muted)]">{confidence.score}/100</span>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {confidence.reasons.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
                Por dentro do lote
              </p>
              <h2 className="mt-2 text-2xl font-black">Custos totais desta produção</h2>
            </div>
            <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black text-[var(--green)]">
              {result.sellableUnits} un. prontas
            </span>
          </div>
          <div className="mt-6 divide-y divide-[var(--border)]">
            <Row label="📦 Materiais (com perdas)" value={result.materialsBatch} />
            <Row label="⏱️ Seu trabalho" value={result.laborBatch} />
            <Row label="🛍️ Embalagens" value={result.packagingBatch} />
            <Row label="🧾 Outros gastos" value={result.extrasBatch} />
            <Row label="Custo total do lote" value={result.totalBatch} strong />
            <Row label="Custo por unidade" value={result.costPerUnit} strong />
          </div>
        </div>

        <AdSlot placement="result-after-breakdown" />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-2xl bg-[var(--green)] px-6 py-4 text-center font-black text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[var(--green-dark)]"
          >
            ⚡ Botar preço em outro produto
          </Link>
          <Link
            href="/historico"
            className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-center font-black transition hover:-translate-y-0.5 hover:bg-[var(--green-soft)]"
          >
            🗂️ Ver meus cálculos
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function SignalCard({
  emoji,
  label,
  value,
  text,
  active,
}: {
  emoji: string;
  label: string;
  value: number;
  text: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        active
          ? "border-[var(--green)] bg-[var(--green-soft)] ring-2 ring-green-700/15"
          : "border-[var(--border)] bg-white"
      }`}
    >
      <strong className="text-xs uppercase tracking-[.13em]">
        {emoji} {label}
      </strong>
      <span className="mt-3 block text-xl font-black sm:text-2xl">{money(value)}</span>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}

function ExplainItem({ term, def }: { term: string; def: string }) {
  return (
    <div>
      <dt className="font-black">{term}</dt>
      <dd className="mt-1 text-sm leading-6 text-[var(--muted)]">{def}</dd>
    </div>
  );
}

function ExplainRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${
        strong ? "font-black text-[var(--green-deep)]" : ""
      }`}
    >
      <span className={strong ? "" : "text-[var(--muted)]"}>{label.padEnd(22, ".")}</span>
      <span className="tabular-nums">{money(value)}</span>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${
        strong ? "font-black text-[var(--green-deep)]" : ""
      }`}
    >
      <span>{label}</span>
      <span>{money(value)}</span>
    </div>
  );
}
