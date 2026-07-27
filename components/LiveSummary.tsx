"use client";

import { useMemo, useState } from "react";
import { calculatePrice, money } from "@/src/domain/pricing";
import type { PricingInput } from "@/types/pricing";

export function LiveSummary({
  input,
  showLabor,
  showPackaging,
  showExtras,
}: {
  input: PricingInput;
  showLabor: boolean;
  showPackaging: boolean;
  showExtras: boolean;
}) {
  const [open, setOpen] = useState(false);

  /** Tudo vem do engine — UI não calcula. */
  const result = useMemo(() => calculatePrice(input), [input]);

  // Materiais “até agora” sem perda (igual comportamento visual 1.9.x no meio do fluxo)
  const materialsLive = result.materialsBatch - result.wasteBatch;
  const totalLive = result.totalBatch - result.wasteBatch;

  return (
    <div className={`live-summary ${open ? "live-summary-open" : ""}`}>
      <button
        type="button"
        className="live-summary-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🧾</span>
          <strong>Sua conta até agora</strong>
        </span>
        <span className="flex items-center gap-3">
          <strong>{money(totalLive)}</strong>
          <span aria-hidden="true">{open ? "⌃" : "⌄"}</span>
        </span>
      </button>
      <div className="live-summary-body">
        <SummaryRow icon="📦" label="Materiais" value={materialsLive} />
        {showLabor && <SummaryRow icon="⏱️" label="Seu trabalho" value={result.laborBatch} />}
        {showPackaging && <SummaryRow icon="🛍️" label="Embalagem" value={result.packagingBatch} />}
        {showExtras && <SummaryRow icon="✨" label="Extras" value={result.extrasBatch} />}
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="live-summary-row">
      <span>
        {icon} {label}
      </span>
      <strong>{money(value)}</strong>
    </div>
  );
}
