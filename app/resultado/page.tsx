"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { money } from "@/lib/calculator";
import type { SavedCalculation } from "@/lib/storage";

export default function ResultadoPage() {
  const [current, setCurrent] = useState<SavedCalculation | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bota-preco-current");
    if (raw) setCurrent(JSON.parse(raw));
  }, []);

  if (!current) {
    return (
      <AppShell compact>
        <div className="rounded-3xl border border-[var(--border)] bg-white p-8 text-center">
          <h1 className="text-3xl font-black">Ainda não temos um cálculo aberto.</h1>
          <Link href="/" className="mt-6 inline-block font-black text-[var(--green)]">
            Começar agora
          </Link>
        </div>
      </AppShell>
    );
  }

  const { input, result } = current;

  return (
    <AppShell compact>
      <section className="space-y-6">
        <div className="rounded-[2rem] bg-[var(--green)] p-6 text-white shadow-lg sm:p-9">
          <p className="font-bold text-white/80">Pronto! Para sua {input.productName}:</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {money(result.healthyPrice)}
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-white/85">
            Esse é o preço verde: uma referência que cobre sua conta e usa a margem escolhida.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <PriceCard
            label="Vermelho"
            value={result.costPerUnit}
            text="Você praticamente só cobre o custo."
            tone="red"
          />
          <PriceCard
            label="Amarelo"
            value={result.minimumPrice}
            text="Tem uma folga pequena."
            tone="yellow"
          />
          <PriceCard
            label="Verde"
            value={result.healthyPrice}
            text="A conta fica mais saudável."
            tone="green"
          />
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">Como essa conta foi montada</h2>

          <div className="mt-6 divide-y divide-[var(--border)]">
            <Row label="Ingredientes e materiais" value={result.materialsBatch} />
            <Row label="Seu trabalho" value={result.laborBatch} />
            <Row label="Embalagens" value={result.packagingBatch} />
            <Row label="Outros gastos" value={result.extrasBatch} />
            <Row label="Custo do lote" value={result.totalBatch} strong />
            <Row label="Custo por unidade" value={result.costPerUnit} strong />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-2xl bg-[var(--green)] px-6 py-4 text-center font-black text-white hover:bg-[var(--green-dark)]"
          >
            Botar preço de outro produto
          </Link>
          <Link
            href="/historico"
            className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-center font-black hover:bg-[var(--green-soft)]"
          >
            Ver meus cálculos
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${strong ? "font-black" : ""}`}>
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
  const classes = {
    red: "border-[#efb6ad] bg-[#fff1ef]",
    yellow: "border-[#ecd28c] bg-[#fff8df]",
    green: "border-[#afd4b9] bg-[#edf8f0]",
  };

  return (
    <div className={`rounded-3xl border p-5 ${classes[tone]}`}>
      <strong className="text-sm uppercase tracking-wide">{label}</strong>
      <span className="mt-3 block text-2xl font-black">{money(value)}</span>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}
