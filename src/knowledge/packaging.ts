import type { PackagingRule } from "@/types/pricing";

export type PackagingSuggestion = {
  name: string;
  defaultRule: PackagingRule;
  defaultQuantity: number;
  defaultEveryXUnits: number;
};

const catalog: Record<string, PackagingSuggestion> = {
  "pote": { name: "Pote", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "tampa": { name: "Tampa", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "colher": { name: "Colher", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "etiqueta adesiva": { name: "Etiqueta adesiva", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "sacola": { name: "Sacola", defaultRule: "everyXUnits", defaultQuantity: 1, defaultEveryXUnits: 2 },
  "marmita": { name: "Marmita", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "forminha de papel": { name: "Forminha de papel", defaultRule: "perUnit", defaultQuantity: 1, defaultEveryXUnits: 1 },
  "caixa para doces": { name: "Caixa para doces", defaultRule: "everyXUnits", defaultQuantity: 1, defaultEveryXUnits: 6 },
  "caixa de papelão": { name: "Caixa de papelão", defaultRule: "perBatch", defaultQuantity: 1, defaultEveryXUnits: 1 },
};

export function getPackagingSuggestion(name: string): PackagingSuggestion {
  return catalog[name.trim().toLocaleLowerCase("pt-BR")] ?? {
    name,
    defaultRule: "perUnit",
    defaultQuantity: 1,
    defaultEveryXUnits: 1,
  };
}

export const packagingNames = Object.values(catalog).map((item) => item.name);
