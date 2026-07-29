export type MeasurementUnit = "g" | "kg" | "ml" | "l" | "cm" | "m" | "un";

export type MaterialItem = {
  id: string;
  name: string;
  brand?: string;
  paid: number;
  packageAmount: number;
  packageUnit: MeasurementUnit;
  usedAmount: number;
  usedUnit: MeasurementUnit;
};

export type PackagingRule = "perUnit" | "everyXUnits" | "perBatch";

export type PackagingItem = {
  id: string;
  name: string;
  paid: number;
  packageAmount: number;
  rule: PackagingRule;
  quantity: number;
  everyXUnits: number;
};

export type ExtraCostItem = {
  id: string;
  name: string;
  amount: number;
};

export type PricingInput = {
  productName: string;
  yieldAmount: number;
  sellableUnits?: number;
  materials: MaterialItem[];
  workHours: number;
  hourlyRate: number;
  packagingItems: PackagingItem[];
  packagingPerUnit: number;
  extraCosts: number;
  extraCostItems?: ExtraCostItem[];
  wastePercent: number;
  salesFeePercent: number;
  hasSalesFee?: boolean;
  desiredMargin: number;
  competitorPrice?: number;
  hasCompetitorRef?: boolean;
};

export type PricingResult = {
  materialsBatch: number;
  wasteBatch: number;
  laborBatch: number;
  packagingBatch: number;
  extrasBatch: number;
  totalBatch: number;
  costPerUnit: number;
  minimumPrice: number;
  healthyPrice: number;
  premiumPrice: number;
  sellableUnits: number;
  wastePercentEffective: number;
};
