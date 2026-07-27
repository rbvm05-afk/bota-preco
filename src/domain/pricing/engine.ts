import { convertAmount } from "@/src/knowledge";
import type { PackagingItem, PricingInput, PricingResult } from "@/types/pricing";

const safe = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

/** Quantidade de embalagem necessária para o rendimento informado. */
export function packagingRequiredUnits(item: PackagingItem, yieldAmount: number): number {
  const quantity = Math.max(0, Number(item.quantity) || 0);
  const units = Math.max(1, safe(yieldAmount));

  if (item.rule === "perBatch") return quantity;
  if (item.rule === "everyXUnits") {
    return Math.ceil(units / Math.max(1, Number(item.everyXUnits) || 1)) * quantity;
  }
  return units * quantity;
}

/** Custo de embalagem do lote (itens inteligentes ou legado packagingPerUnit). */
export function packagingBatchCost(input: PricingInput): number {
  const yieldAmount = Math.max(1, safe(input.yieldAmount));
  const items = input.packagingItems ?? [];

  if (items.length > 0) {
    return items.reduce((total, item) => {
      const paid = safe(item.paid);
      const packageAmount = safe(item.packageAmount);
      if (!paid || !packageAmount) return total;

      const unitCost = paid / packageAmount;
      return total + unitCost * packagingRequiredUnits(item, yieldAmount);
    }, 0);
  }

  return safe(input.packagingPerUnit) * yieldAmount;
}

/**
 * Único ponto de cálculo do Bota Preço.
 * Sem React, sem Next, sem storage — só domínio.
 */
export function calculatePrice(input: PricingInput): PricingResult {
  const yieldAmount = Math.max(1, safe(input.yieldAmount));

  const rawMaterialsBatch = input.materials.reduce((total, item) => {
    const paid = safe(item.paid);
    const packageAmount = safe(item.packageAmount);
    const usedAmount = safe(item.usedAmount);
    if (!packageAmount) return total;

    const packageUnit = item.packageUnit ?? "g";
    const usedUnit = item.usedUnit ?? packageUnit;
    const usedInPackageUnit = convertAmount(usedAmount, usedUnit, packageUnit);
    if (usedInPackageUnit === null) return total;

    return total + (paid / packageAmount) * usedInPackageUnit;
  }, 0);

  const wasteRate = Math.min(50, safe(input.wastePercent ?? 0)) / 100;
  const wasteBatch = rawMaterialsBatch * wasteRate;
  const materialsBatch = rawMaterialsBatch + wasteBatch;
  const laborBatch = safe(input.workHours) * safe(input.hourlyRate);
  const packagingBatch = packagingBatchCost(input);
  const extrasBatch = safe(input.extraCosts);
  const totalBatch = materialsBatch + laborBatch + packagingBatch + extrasBatch;
  const costPerUnit = totalBatch / yieldAmount;

  const margin = Math.min(89, Math.max(0, safe(input.desiredMargin))) / 100;
  const salesFee = Math.min(40, Math.max(0, safe(input.salesFeePercent ?? 0))) / 100;
  const denominator = Math.max(0.05, 1 - margin - salesFee);
  const healthyPrice = costPerUnit / denominator;

  return {
    materialsBatch,
    wasteBatch,
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
