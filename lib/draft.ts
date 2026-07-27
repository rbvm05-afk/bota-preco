import type { PricingInput } from "@/types/pricing";

export type WizardDraft = {
  mode: "rapidin" | "completao";
  input: PricingInput;
  stepIndex: number;
  updatedAt: string;
};

const draftKey = (mode: string) => `bota-preco-draft:${mode}`;

export function saveDraft(mode: WizardDraft["mode"], input: PricingInput, stepIndex: number) {
  if (typeof window === "undefined") return;
  const payload: WizardDraft = {
    mode,
    input,
    stepIndex,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(draftKey(mode), JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

export function loadDraft(mode: WizardDraft["mode"]): WizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(mode));
    if (!raw) return null;
    return JSON.parse(raw) as WizardDraft;
  } catch {
    return null;
  }
}

export function clearDraft(mode: WizardDraft["mode"]) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(mode));
}
