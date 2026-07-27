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
  const fee = (input.salesFeePercent ?? 0) / 100;
  const profitPerUnit = result.healthyPrice * (1 - fee) - result.costPerUnit;
  const hours = Math.max(0.01, input.workHours || 0.01);
  const profitPerHour = (profitPerUnit * Math.max(1, input.yieldAmount)) / hours;

  const confClass =
    confidence.level === "high"
      ? "bg-[var(--green-soft)] text-[var(--green)]"
      : confidence.level === "medium"
        ? "bg-[#fff8df] text-[#8a6a00]"
        : "bg-[#fff1ef] text-[var(--red)]";

  const diagClass: Record<string, string> = {
    green: "border-[#9bc7a8] bg-[#eaf5ed]",
    yellow: "border-[#ecd28c] bg-[#fff8df]",
    orange: "border-[#f0c9a0] bg-[#fff6eb]",
    red: "border-[#efb6ad] bg-[#fff1ef]",
  };

  return (
    <AppShell compact>
      <section className="animate-rise space-y-5">
        <div className="relative overflow-hidden rounded-[2.3rem] bg-[var(--green-deep)] p-7 text-white shadow-2xl shadow-green-950/20 sm:p-10">
          <div className="absolute -right-12 -top-16 size-48 rounded-full border-[28px] border-white/5" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.15em]">
              ✅ Preço recomendado
            </span>
            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${confClass}`}>
              {confidence.label}
            </span>
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
        </div>

        <div className={`rounded-[1.5rem] border p-5 ${diagClass[diagnosis.tone] ?? diagClass.yellow}`}>
          <p className="text-lg font-black">
            {diagnosis.emoji} {diagnosis.title}
          </p>
          <p className="mt-2 leading-6 text-[var(--muted)]">{diagnosis.message}</p>
        </div>

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Por que este preço?</p>
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
            {explanation.feePercent > 0 ? ` e taxa de ${explanation.feePercent}%` : ""}, o preço recomendado
            fica em <strong className="text-[var(--green-deep)]">{money(explanation.recommendedPrice)}</strong> por
            unidade.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PriceCard label="⬛ Prejuízo abaixo de" value={result.costPerUnit} text="Não cobre o custo." tone="red" />
          <PriceCard label="🟡 Mínimo" value={result.minimumPrice} text="Folga pequena." tone="yellow" />
          <PriceCard label="🟢 Recomendado" value={result.healthyPrice} text="Referência saudável." tone="green" />
          <PriceCard label="🔵 Premium" value={result.premiumPrice} text="Se o mercado pagar." tone="blue" />
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
              <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Por dentro do lote</p>
              <h2 className="mt-2 text-2xl font-black">Custos totais desta produção</h2>
            </div>
            <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black text-[var(--green)]">
              {explanation.batch.yieldAmount} un.
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

function ExplainRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${strong ? "font-black text-[var(--green-deep)]" : ""}`}>
      <span className={strong ? "" : "text-[var(--muted)]"}>{label.padEnd(22, ".")}</span>
      <span className="tabular-nums">{money(value)}</span>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${strong ? "font-black text-[var(--green-deep)]" : ""}`}>
      <span>{label}</span>
      <span>{money(value)}</span>
    </div>
  );
}

function PriceCard({
  label,
  value,
  text,
  tone,
}: {
  label: string;
  value: number;
  text: string;
  tone: "red" | "yellow" | "green" | "blue";
}) {
  const cls = {
    red: "border-[#efb6ad] bg-[#fff1ef]",
    yellow: "border-[#ecd28c] bg-[#fff8df]",
    green: "border-[#9bc7a8] bg-[#eaf5ed] ring-2 ring-green-700/10",
    blue: "border-[#9bc4e8] bg-[#eef6fc]",
  };
  return (
    <div className={`rounded-3xl border p-5 ${cls[tone]}`}>
      <strong className="text-xs uppercase tracking-[.13em]">{label}</strong>
      <span className="mt-3 block text-xl font-black sm:text-2xl">{money(value)}</span>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}
