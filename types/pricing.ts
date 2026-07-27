export type MeasurementUnit = "g" | "kg" | "ml" | "l" | "cm" | "m" | "un";

export type MaterialItem = {
  id: string;
  name: string;
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

export type PricingInput = {
  productName: string;
  yieldAmount: number;
  materials: MaterialItem[];
  workHours: number;
  hourlyRate: number;
  packagingItems: PackagingItem[];
  /** Mantido para abrir cálculos antigos da 1.9.1 sem quebrar. */
  packagingPerUnit: number;
  extraCosts: number;
  wastePercent: number;
  salesFeePercent: number;
  desiredMargin: number;
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
};
