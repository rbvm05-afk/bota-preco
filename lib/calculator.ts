import type { PricingInput, PricingResult } from "@/types/pricing";

const safe = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

export function calculatePrice(input: PricingInput): PricingResult {
  const yieldAmount = Math.max(1, safe(input.yieldAmount));

  const materialsBatch = input.materials.reduce((total, item) => {
    const paid = safe(item.paid);
    const packageAmount = safe(item.packageAmount);
    const usedAmount = safe(item.usedAmount);

    if (!packageAmount) return total;

    return total + (paid / packageAmount) * usedAmount;
  }, 0);

  const laborBatch = safe(input.workHours) * safe(input.hourlyRate);
  const packagingBatch = safe(input.packagingPerUnit) * yieldAmount;
  const extrasBatch = safe(input.extraCosts);
  const totalBatch = materialsBatch + laborBatch + packagingBatch + extrasBatch;
  const costPerUnit = totalBatch / yieldAmount;

  const margin = Math.min(90, Math.max(0, safe(input.desiredMargin))) / 100;
  const healthyPrice = margin >= 0.9 ? costPerUnit : costPerUnit / (1 - margin);

  return {
    materialsBatch,
    laborBatch,
    packagingBatch,
    extrasBatch,
    totalBatch,
    costPerUnit,
    minimumPrice: costPerUnit * 1.12,
    healthyPrice,
    premiumPrice: healthyPrice * 1.18,
  };
}

export function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(value) ? value : 0);
}
