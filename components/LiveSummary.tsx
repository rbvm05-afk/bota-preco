"use client";

import { useMemo, useState } from "react";
import { convertAmount } from "@/src/knowledge";
import { money, packagingBatchCost } from "@/lib/calculator";
import type { PricingInput } from "@/types/pricing";

function materialCost(input: PricingInput) {
  return input.materials.reduce((sum, item) => {
    if (!item.paid || !item.packageAmount || !item.usedAmount) return sum;
    const packageUnit = item.packageUnit ?? "g";
    const usedUnit = item.usedUnit ?? packageUnit;
    const usedInPackageUnit = convertAmount(item.usedAmount, usedUnit, packageUnit);
    if (usedInPackageUnit === null) return sum;
    return sum + (item.paid / item.packageAmount) * usedInPackageUnit;
  }, 0);
}

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
  const values = useMemo(() => {
    const materials = materialCost(input);
    const labor = input.workHours * input.hourlyRate;
    const packaging = packagingBatchCost(input);
    const extras = input.extraCosts;
    return {
      materials,
      labor,
      packaging,
      extras,
      total: materials + labor + packaging + extras,
    };
  }, [input]);

  return (
    <div className={`live-summary ${open ? "live-summary-open" : ""}`}>
      <button type="button" className="live-summary-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🧾</span>
          <strong>Sua conta até agora</strong>
        </span>
        <span className="flex items-center gap-3">
          <strong>{money(values.total)}</strong>
          <span aria-hidden="true">{open ? "⌃" : "⌄"}</span>
        </span>
      </button>
      <div className="live-summary-body">
        <SummaryRow icon="📦" label="Materiais" value={values.materials} />
        {showLabor && <SummaryRow icon="⏱️" label="Seu trabalho" value={values.labor} />}
        {showPackaging && <SummaryRow icon="🛍️" label="Embalagem" value={values.packaging} />}
        {showExtras && <SummaryRow icon="✨" label="Extras" value={values.extras} />}
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="live-summary-row">
      <span>{icon} {label}</span>
      <strong>{money(value)}</strong>
    </div>
  );
}
