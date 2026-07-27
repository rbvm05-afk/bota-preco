import type { PricingInput, PricingResult } from "@/types/pricing";
import type { SmartPricingReport } from "./types";
import { buildExplanation } from "./explanation";
import { diagnoseRecommended } from "./diagnosis";
import { assessConfidence } from "./confidence";
import { buildInsights } from "./insights";

export function buildSmartPricingReport(
  input: PricingInput,
  result: PricingResult,
): SmartPricingReport {
  return {
    explanation: buildExplanation(input, result),
    diagnosis: diagnoseRecommended(input, result),
    confidence: assessConfidence(input),
    insights: buildInsights(input, result),
    bands: {
      loss: result.costPerUnit,
      minimum: result.minimumPrice,
      recommended: result.healthyPrice,
      premium: result.premiumPrice,
    },
  };
}
