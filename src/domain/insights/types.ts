export type DiagnosisTone = "green" | "yellow" | "orange" | "red";

export type PricingDiagnosis = {
  tone: DiagnosisTone;
  emoji: string;
  title: string;
  message: string;
};

export type ConfidenceLevel = "high" | "medium" | "low";

export type ConfidenceReport = {
  level: ConfidenceLevel;
  label: string;
  reasons: string[];
  score: number;
};

export type PricingInsight = {
  id: string;
  severity: "info" | "warn" | "critical";
  title: string;
  message: string;
};

export type PriceBand = "loss" | "minimum" | "recommended" | "premium";

export type UnitBreakdown = {
  materials: number;
  waste: number;
  packaging: number;
  labor: number;
  extras: number;
  costTotal: number;
};

export type PriceExplanation = {
  perUnit: UnitBreakdown;
  batch: {
    materials: number;
    waste: number;
    packaging: number;
    labor: number;
    extras: number;
    total: number;
    yieldAmount: number;
  };
  recommendedPrice: number;
  marginPercent: number;
  feePercent: number;
};

export type SimulationResult = {
  sellPrice: number;
  profitPerUnit: number;
  marginPercent: number;
  profitPerHour: number;
  profitBatch: number;
  netRevenuePerUnit: number;
  diffToRecommended: number;
  band: PriceBand;
  diagnosis: PricingDiagnosis;
};

export type SmartPricingReport = {
  explanation: PriceExplanation;
  diagnosis: PricingDiagnosis;
  confidence: ConfidenceReport;
  insights: PricingInsight[];
  bands: {
    loss: number;
    minimum: number;
    recommended: number;
    premium: number;
  };
};
