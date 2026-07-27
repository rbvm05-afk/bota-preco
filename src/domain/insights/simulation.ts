import type { PricingInput, PricingResult } from "@/types/pricing";
import type { PriceBand, SimulationResult } from "./types";
import { diagnoseSellPrice } from "./diagnosis";

const safe = (n: number) => (Number.isFinite(n) ? n : 0);

export function simulateSellPrice(
  input: PricingInput,
  result: PricingResult,
  sellPrice: number,
): SimulationResult {
  const price = Math.max(0, safe(sellPrice));
  const yieldAmount = Math.max(1, input.yieldAmount || 1);
  const fee = Math.min(40, Math.max(0, safe(input.salesFeePercent ?? 0))) / 100;
  const netRevenuePerUnit = price * (1 - fee);
  const profitPerUnit = netRevenuePerUnit - result.costPerUnit;
  const profitBatch = profitPerUnit * yieldAmount;
  const marginPercent =
    netRevenuePerUnit > 0 ? (profitPerUnit / netRevenuePerUnit) * 100 : profitPerUnit < 0 ? -100 : 0;
  const hours = Math.max(0.01, safe(input.workHours) || 0.01);
  const profitPerHour = profitBatch / hours;
  const band = resolveBand(price, result);
  const diagnosis = diagnoseSellPrice(profitPerUnit, marginPercent, band, input, result);

  return {
    sellPrice: price,
    profitPerUnit,
    marginPercent,
    profitPerHour,
    profitBatch,
    netRevenuePerUnit,
    diffToRecommended: price - result.healthyPrice,
    band,
    diagnosis,
  };
}

export function resolveBand(price: number, result: PricingResult): PriceBand {
  if (price < result.costPerUnit) return "loss";
  if (price < result.minimumPrice) return "minimum";
  if (price < result.premiumPrice) return "recommended";
  return "premium";
}
