import { convertAmount } from "@/src/knowledge";
import type { PackagingItem, PricingInput, PricingResult } from "@/types/pricing";

const safe = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

export function packagingRequiredUnits(item: PackagingItem, yieldAmount: number): number {
  const quantity = Math.max(0, Number(item.quantity) || 0);
  const units = Math.max(1, safe(yieldAmount));
  if (item.rule === "perBatch") return quantity;
  if (item.rule === "everyXUnits") {
    return Math.ceil(units / Math.max(1, Number(item.everyXUnits) || 1)) * quantity;
  }
  return units * quantity;
}

export function packagingBatchCost(input: PricingInput): number {
  const yieldAmount = Math.max(1, safe(input.yieldAmount));
  const items = input.packagingItems ?? [];
  if (items.length > 0) {
    return items.reduce((total, item) => {
      const paid = safe(item.paid);
      const packageAmount = safe(item.packageAmount);
      if (!paid || !packageAmount) return total;
      return total + (paid / packageAmount) * packagingRequiredUnits(item, yieldAmount);
    }, 0);
  }
  return safe(input.packagingPerUnit) * yieldAmount;
}

export function sumExtraCosts(input: PricingInput): number {
  const items = input.extraCostItems;
  if (items && items.length > 0) {
    return items.reduce((t, i) => t + safe(i.amount), 0);
  }
  return safe(input.extraCosts);
}

export function effectiveWasteRate(input: PricingInput): number {
  const planned = Math.max(1, safe(input.yieldAmount));
  const sellable =
    input.sellableUnits !== undefined && input.sellableUnits !== null
      ? Math.max(0, Number(input.sellableUnits) || 0)
      : null;
  if (sellable !== null) {
    if (sellable >= planned) return 0;
    return Math.min(0.5, (planned - sellable) / planned);
  }
  return Math.min(0.5, safe(input.wastePercent ?? 0) / 100);
}

export function effectiveSellableUnits(input: PricingInput): number {
  const planned = Math.max(1, safe(input.yieldAmount));
  if (input.sellableUnits !== undefined && input.sellableUnits !== null) {
    return Math.max(1, Number(input.sellableUnits) || 1);
  }
  const rate = effectiveWasteRate(input);
  return Math.max(1, Math.round(planned * (1 - rate)));
}

export function calculatePrice(input: PricingInput): PricingResult {
  const sellableUnits = effectiveSellableUnits(input);
  const wasteRate = effectiveWasteRate(input);

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

  const wasteBatch = rawMaterialsBatch * wasteRate;
  const materialsBatch = rawMaterialsBatch + wasteBatch;
  const laborBatch = safe(input.workHours) * safe(input.hourlyRate);
  const packagingBatch = packagingBatchCost(input);
  const extrasBatch = sumExtraCosts(input);
  const totalBatch = materialsBatch + laborBatch + packagingBatch + extrasBatch;
  const costPerUnit = totalBatch / sellableUnits;

  const margin = Math.min(89, Math.max(0, safe(input.desiredMargin))) / 100;
  const salesFee =
    input.hasSalesFee === false
      ? 0
      : Math.min(40, Math.max(0, safe(input.salesFeePercent ?? 0))) / 100;
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
    sellableUnits,
    wastePercentEffective: Math.round(wasteRate * 1000) / 10,
  };
}
