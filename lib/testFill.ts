import type { MaterialItem, PackagingItem, PricingInput } from "@/types/pricing";
import { getBlueprint, getInputDefaults } from "@/src/domain/products";

const mat = (
  name: string,
  paid: number,
  packageAmount: number,
  usedAmount: number,
  unit: MaterialItem["packageUnit"] = "g",
): MaterialItem => ({
  id: crypto.randomUUID(),
  name,
  brand: "Genérica",
  paid,
  packageAmount,
  packageUnit: unit,
  usedAmount,
  usedUnit: unit,
});

const pack = (
  name: string,
  paid: number,
  qty: number,
  rule: PackagingItem["rule"] = "perUnit",
  everyXUnits = 1,
): PackagingItem => ({
  id: crypto.randomUUID(),
  name,
  paid,
  packageAmount: 1,
  rule,
  quantity: qty,
  everyXUnits,
});

/**
 * Gera um PricingInput completo com valores simbólicos para QA.
 * Não apaga o modo nem dados já salvos no histórico.
 */
export function buildTestInput(current?: Partial<PricingInput>): PricingInput {
  const productName = current?.productName?.trim() || "Bolo de pote";
  const bp = getBlueprint(productName);
  const defaults = getInputDefaults(productName);
  const yieldAmount = defaults.yieldAmount || 12;

  const materials: MaterialItem[] =
    bp.suggestedMaterials.length > 0
      ? bp.suggestedMaterials.map((name, i) =>
          mat(name, 8 + i * 3.5, 500, 100 + i * 20, "g"),
        )
      : [
          mat("Farinha de trigo", 6.9, 1000, 250, "g"),
          mat("Açúcar", 4.5, 1000, 150, "g"),
          mat("Ovos", 12, 12, 3, "un"),
        ];

  const packagingItems: PackagingItem[] =
    bp.suggestedPackaging.length > 0
      ? bp.suggestedPackaging.map((name, i) => {
          if (name.toLowerCase().includes("sacola")) {
            return pack(name, 0.35, Math.ceil(yieldAmount / 2), "everyXUnits", 2);
          }
          return pack(name, 0.4 + i * 0.15, yieldAmount, "perUnit");
        })
      : [pack("Embalagem", 0.5, yieldAmount, "perUnit")];

  return {
    productName,
    yieldAmount,
    sellableUnits: yieldAmount,
    materials,
    workHours: defaults.workHours,
    hourlyRate: defaults.hourlyRate,
    packagingItems,
    packagingPerUnit: 0,
    extraCosts: 0,
    extraCostItems: [
      { id: crypto.randomUUID(), name: "Gás", amount: 3.5 },
      { id: crypto.randomUUID(), name: "Energia", amount: 2 },
    ],
    wastePercent: defaults.wastePercent,
    salesFeePercent: 3.5,
    hasSalesFee: true,
    desiredMargin: defaults.desiredMargin,
    competitorPrice: undefined,
    hasCompetitorRef: false,
  };
}
