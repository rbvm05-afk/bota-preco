import type { PricingInput } from "@/types/pricing";
import type { ConfidenceReport } from "./types";

export function assessConfidence(input: PricingInput): ConfidenceReport {
  let score = 0;
  const reasons: string[] = [];
  const gaps: string[] = [];

  const materials = input.materials.filter((m) => m.name.trim());
  const completeMaterials = materials.filter(
    (m) => m.paid > 0 && m.packageAmount > 0 && m.usedAmount > 0,
  );

  if (completeMaterials.length >= 2) {
    score += 30;
    reasons.push("Ingredientes preenchidos com valores");
  } else if (completeMaterials.length === 1) {
    score += 15;
    gaps.push("Poucos ingredientes com valores completos");
  } else {
    gaps.push("Ingredientes incompletos ou sem preço");
  }

  const packs = (input.packagingItems ?? []).filter((p) => p.name.trim() && p.paid > 0);
  if (packs.length > 0) {
    score += 20;
    reasons.push("Embalagem com preço informado");
  } else if ((input.packagingItems ?? []).length === 0 && !input.packagingPerUnit) {
    score += 5;
    gaps.push("Nenhuma embalagem informada");
  } else {
    gaps.push("Embalagem sem preço completo");
  }

  if (input.workHours > 0) {
    score += 20;
    reasons.push("Tempo de produção informado");
  } else {
    gaps.push("Tempo de produção não informado");
  }

  if (input.hourlyRate > 0) {
    score += 10;
    reasons.push("Valor da hora definido");
  } else {
    gaps.push("Valor da hora zerado");
  }

  if (input.wastePercent > 0) {
    score += 10;
    reasons.push("Perdas consideradas");
  } else {
    gaps.push("Perdas não informadas (pode subestimar o custo)");
  }

  if (input.yieldAmount > 1) {
    score += 10;
    reasons.push("Rendimento definido");
  }

  score = Math.min(100, score);

  let level: ConfidenceReport["level"];
  let label: string;
  if (score >= 70) {
    level = "high";
    label = "Alta confiança";
  } else if (score >= 40) {
    level = "medium";
    label = "Média confiança";
  } else {
    level = "low";
    label = "Baixa confiança";
  }

  return {
    level,
    label,
    score,
    reasons: gaps.length > 0 && level !== "high" ? gaps : reasons.slice(0, 3),
  };
}
