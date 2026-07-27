import type { MeasurementUnit } from "@/types/pricing";
import { knowledgeCatalog } from "./catalog";
import type { KnowledgeItem } from "./types";

export const unitLabels: Record<MeasurementUnit, string> = {
  g: "g",
  kg: "kg",
  ml: "mL",
  l: "L",
  cm: "cm",
  m: "m",
  un: "un.",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");

export function findKnowledgeItem(name: string): KnowledgeItem | undefined {
  const query = normalize(name);
  if (!query) return undefined;
  return knowledgeCatalog.find((item) =>
    normalize(item.name) === query || item.aliases.some((alias) => normalize(alias) === query),
  );
}

export function inferUnits(name: string): Pick<KnowledgeItem, "defaultUnit" | "allowedUnits"> {
  const known = findKnowledgeItem(name);
  if (known) return known;

  const value = normalize(name);
  if (!/condensado|em po|po\b/.test(value) && /leite|suco|oleo|essencia|extrato|calda|agua/.test(value)) {
    return { defaultUnit: "ml", allowedUnits: ["ml", "l"] };
  }
  if (/pavio|linha|fio|fita|cord[aã]o/.test(value)) {
    return { defaultUnit: "cm", allowedUnits: ["cm", "m", "un"] };
  }
  if (/pote|caixa|ovo|etiqueta|tampa|sacola|frasco|forma/.test(value)) {
    return { defaultUnit: "un", allowedUnits: ["un"] };
  }
  return { defaultUnit: "g", allowedUnits: ["g", "kg"] };
}

const unitFamily: Record<MeasurementUnit, "mass" | "volume" | "length" | "count"> = {
  g: "mass", kg: "mass", ml: "volume", l: "volume", cm: "length", m: "length", un: "count",
};

const toBaseFactor: Record<MeasurementUnit, number> = {
  g: 1, kg: 1000, ml: 1, l: 1000, cm: 1, m: 100, un: 1,
};

export function convertAmount(value: number, from: MeasurementUnit, to: MeasurementUnit): number | null {
  if (unitFamily[from] !== unitFamily[to]) return null;
  return (value * toBaseFactor[from]) / toBaseFactor[to];
}
