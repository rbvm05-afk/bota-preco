import type { PricingInput, PricingResult } from "@/types/pricing";

export type SavedCalculation = {
  id: string;
  createdAt: string;
  mode: "rapidin" | "completin";
  input: PricingInput;
  result: PricingResult;
};

const KEY = "bota-preco-calculations";

export function saveCalculation(item: SavedCalculation) {
  if (typeof window === "undefined") return;
  const current = getCalculations();
  localStorage.setItem(KEY, JSON.stringify([item, ...current].slice(0, 30)));
}

export function getCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearCalculations() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
