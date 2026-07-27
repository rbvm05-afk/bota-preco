"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdSlot } from "@/components/AdSlot";
import { calculatePrice, money } from "@/src/domain/pricing";
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

  if (!current) {
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

  return (
    <AppShell compact>
      <section className="animate-rise space-y-5">
        <div className="relative overflow-hidden rounded-[2.3rem] bg-[var(--green-deep)] p-7 text-white shadow-2xl shadow-green-950/20 sm:p-10">
          <div className="absolute -right-12 -top-16 size-48 rounded-full border-[28px] border-white/5" />
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.15em]">
            ✅ Preço que faz sentido
          </span>
          <p className="mt-6 font-bold text-white/70">
            Para sua {input.productName}, o Bota chegou nesta referência:
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-[-.05em] sm:text-6xl">
            {money(result.healthyPrice)}
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-white/75">
            Nada de número tirado do ar: esse valor junta seus custos, taxas e a margem que você escolheu.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <PriceCard label="Preço vermelho" value={result.costPerUnit} text="Você praticamente só cobre o custo." tone="red" />
          <PriceCard label="Preço amarelo" value={result.minimumPrice} text="Existe uma folga, mas ainda é apertado." tone="yellow" />
          <PriceCard label="Preço verde" value={result.healthyPrice} text="Uma referência mais saudável para vender." tone="green" />
        </div>

        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Por dentro da conta</p>
              <h2 className="mt-2 text-2xl font-black">Como chegamos nesse valor</h2>
            </div>
            <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black text-[var(--green)]">
              por unidade
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
  tone: "red" | "yellow" | "green";
}) {
  const cls = {
    red: "border-[#efb6ad] bg-[#fff1ef]",
    yellow: "border-[#ecd28c] bg-[#fff8df]",
    green: "border-[#9bc7a8] bg-[#eaf5ed] ring-2 ring-green-700/10",
  };
  return (
    <div className={`rounded-3xl border p-5 ${cls[tone]}`}>
      <strong className="text-xs uppercase tracking-[.13em]">{label}</strong>
      <span className="mt-3 block text-2xl font-black">{money(value)}</span>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}
