export type MaterialItem = {
  id: string;
  name: string;
  paid: number;
  packageAmount: number;
  usedAmount: number;
};

export type PricingInput = {
  productName: string;
  yieldAmount: number;
  materials: MaterialItem[];
  workHours: number;
  hourlyRate: number;
  packagingPerUnit: number;
  extraCosts: number;
  desiredMargin: number;
};

export type PricingResult = {
  materialsBatch: number;
  laborBatch: number;
  packagingBatch: number;
  extrasBatch: number;
  totalBatch: number;
  costPerUnit: number;
  minimumPrice: number;
  healthyPrice: number;
  premiumPrice: number;
};
