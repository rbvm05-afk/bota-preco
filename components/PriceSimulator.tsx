"use client";

import { useMemo, useState } from "react";
import { money } from "@/src/domain/pricing";
import { simulateSellPrice, type SimulationResult } from "@/src/domain/insights";
import type { PricingInput, PricingResult } from "@/types/pricing";

const bandLabel: Record<SimulationResult["band"], string> = {
  loss: "⬛ Prejuízo",
  minimum: "🟡 Mínimo",
  recommended: "🟢 Recomendado",
  premium: "🔵 Premium",
};

const toneClass: Record<string, string> = {
  green: "border-[#9bc7a8] bg-[#eaf5ed]",
  yellow: "border-[#ecd28c] bg-[#fff8df]",
  orange: "border-[#f0c9a0] bg-[#fff6eb]",
  red: "border-[#efb6ad] bg-[#fff1ef]",
};

export function PriceSimulator({
  input,
  result,
}: {
  input: PricingInput;
  result: PricingResult;
}) {
  const [raw, setRaw] = useState(String(Math.round(result.healthyPrice * 100) / 100));
  const sellPrice = Number(raw.replace(",", ".")) || 0;

  const sim = useMemo(
    () => simulateSellPrice(input, result, sellPrice),
    [input, result, sellPrice],
  );

  return (
    <div className="surface rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Simulador</p>
      <h2 className="mt-2 text-2xl font-black">E se eu vender por…</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Digite qualquer preço. O Bota recalcula lucro, margem e diagnóstico na hora.
      </p>

      <label className="mt-5 block">
        <span className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">Preço de venda (R$)</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-2xl font-black outline-none focus:border-[var(--green)]"
        />
      </label>

      <div className={`mt-5 rounded-2xl border p-4 ${toneClass[sim.diagnosis.tone] ?? toneClass.yellow}`}>
        <p className="font-black">
          {sim.diagnosis.emoji} {sim.diagnosis.title}
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{sim.diagnosis.message}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Lucro por unidade" value={money(sim.profitPerUnit)} highlight={sim.profitPerUnit >= 0} />
        <Metric label="Margem efetiva" value={`${sim.marginPercent.toFixed(1).replace(".", ",")}%`} />
        <Metric label="Lucro por hora" value={money(sim.profitPerHour)} />
        <Metric
          label="Diferença do recomendado"
          value={`${sim.diffToRecommended >= 0 ? "+" : ""}${money(sim.diffToRecommended)}`}
        />
      </div>

      <p className="mt-4 text-sm font-bold text-[var(--muted)]">
        Faixa: {bandLabel[sim.band]} · Lucro do lote: {money(sim.profitBatch)}
      </p>

      <BandTrack result={result} sellPrice={sellPrice} />
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
      <span className="text-xs font-bold text-[var(--muted)]">{label}</span>
      <strong className={`mt-1 block text-lg font-black ${highlight === false ? "text-[var(--red)]" : ""}`}>
        {value}
      </strong>
    </div>
  );
}

function BandTrack({ result, sellPrice }: { result: PricingResult; sellPrice: number }) {
  const max = Math.max(result.premiumPrice * 1.15, sellPrice * 1.05, 1);
  const pct = (v: number) => Math.min(100, Math.max(0, (v / max) * 100));

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-black uppercase tracking-wide text-[var(--muted)]">Onde seu preço está</p>
      <div className="relative h-4 overflow-hidden rounded-full bg-[#e9e4da]">
        <div
          className="absolute inset-y-0 left-0 bg-[#efb6ad]"
          style={{ width: `${pct(result.costPerUnit)}%` }}
        />
        <div
          className="absolute inset-y-0 bg-[#ecd28c]"
          style={{
            left: `${pct(result.costPerUnit)}%`,
            width: `${Math.max(0, pct(result.minimumPrice) - pct(result.costPerUnit))}%`,
          }}
        />
        <div
          className="absolute inset-y-0 bg-[#9bc7a8]"
          style={{
            left: `${pct(result.minimumPrice)}%`,
            width: `${Math.max(0, pct(result.healthyPrice) - pct(result.minimumPrice))}%`,
          }}
        />
        <div
          className="absolute inset-y-0 bg-[#7eb8e8]"
          style={{
            left: `${pct(result.healthyPrice)}%`,
            width: `${Math.max(0, 100 - pct(result.healthyPrice))}%`,
          }}
        />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--green-deep)] shadow"
          style={{ left: `${pct(sellPrice)}%` }}
          title={money(sellPrice)}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-wide text-[var(--muted)]">
        <span>⬛ Prejuízo</span>
        <span>🟡 Mínimo</span>
        <span>🟢 Recomendado</span>
        <span>🔵 Premium</span>
      </div>
    </div>
  );
}
