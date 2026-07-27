"use client";

import type { PricingInput } from "@/types/pricing";

/**
 * Durante o questionário: só status de preenchimento — sem valores financeiros.
 */
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
  const materialsOk =
    input.materials.filter((m) => m.name.trim() && m.paid > 0 && m.usedAmount > 0).length > 0;
  const packagingOk =
    (input.packagingItems ?? []).filter((p) => p.name.trim() && p.paid > 0).length > 0;
  const laborOk = input.workHours > 0 && input.hourlyRate > 0;

  const lines: string[] = [];
  if (materialsOk) lines.push("Ingredientes preenchidos");
  if (showPackaging && packagingOk) lines.push("Embalagem preenchida");
  if (showLabor && !laborOk) lines.push("Ainda falta informar seu tempo");
  else if (showLabor && laborOk) lines.push("Tempo informado");
  if (showExtras && input.extraCosts > 0) lines.push("Extras informados");

  if (lines.length === 0) return null;

  return (
    <div className="completion-hints mb-4" aria-live="polite">
      {lines.map((line) => (
        <span key={line} className="completion-chip">
          {line}
        </span>
      ))}
    </div>
  );
}
