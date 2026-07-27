import type { PricingInput, PricingResult } from "@/types/pricing";
import type { PriceExplanation } from "./types";

export function buildExplanation(
  input: PricingInput,
  result: PricingResult,
): PriceExplanation {
  const yieldAmount = Math.max(1, input.yieldAmount || 1);
  const materialsOnly = result.materialsBatch - result.wasteBatch;

  return {
    perUnit: {
      materials: materialsOnly / yieldAmount,
      waste: result.wasteBatch / yieldAmount,
      packaging: result.packagingBatch / yieldAmount,
      labor: result.laborBatch / yieldAmount,
      extras: result.extrasBatch / yieldAmount,
      costTotal: result.costPerUnit,
    },
    batch: {
      materials: materialsOnly,
      waste: result.wasteBatch,
      packaging: result.packagingBatch,
      labor: result.laborBatch,
      extras: result.extrasBatch,
      total: result.totalBatch,
      yieldAmount,
    },
    recommendedPrice: result.healthyPrice,
    marginPercent: input.desiredMargin,
    feePercent: input.salesFeePercent ?? 0,
  };
}
