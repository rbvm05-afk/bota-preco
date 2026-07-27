import type { PricingInput } from "@/types/pricing";

export type WizardField = keyof PricingInput;
export type QuestionKind = "product" | "materials" | "packaging" | "number" | "margin";

export type WizardQuestion = {
  id: string;
  field: WizardField;
  kind: QuestionKind;
  label: string;
  eyebrow: string;
  title: string;
  text: string;
  inputLabel?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  tip?: string;
};

export type ProductProfile = {
  id: string;
  category: string;
  displayName?: string;
  matches: string[];
  materialLabel: string;
  materialExamples: string[];
  suggestedMaterials: string[];
  suggestedPackaging: string[];
  materialPlaceholder: string;
  questions: WizardQuestion[];
};
