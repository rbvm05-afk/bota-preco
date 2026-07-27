import type { WizardQuestion } from "@/engine/types";
import type { PricingInput } from "@/types/pricing";

export type WizardContextItem = {
  id: string;
  kind: "tip" | "nudge" | "checklist" | "warning";
  text: string;
};

export function getStepContext(
  question: WizardQuestion | null,
  input: PricingInput,
  isReview: boolean
): WizardContextItem[] {
  if (isReview) {
    return [
      {
        id: "review-check",
        kind: "nudge",
        text: "Confira se está tudo certo. Você pode voltar em qualquer bloco antes de ver o preço.",
      },
    ];
  }

  if (!question) return [];

  const items: WizardContextItem[] = [];

  if (question.tip) {
    items.push({
      id: `tip-${question.id}`,
      kind: "tip",
      text: question.tip.replace("{produto}", input.productName || "seu produto"),
    });
  }

  if (question.id === "materials") {
    items.push({
      id: "materials-nudge",
      kind: "nudge",
      text: "Pode começar só com o principal. Depois você ajusta se quiser.",
    });
  }

  if (question.id === "packaging") {
    items.push({
      id: "packaging-nudge",
      kind: "nudge",
      text: "Marque só o que realmente usa. O resto pode ficar de fora.",
    });
  }

  if (question.id === "hours" || question.id === "hourlyRate") {
    items.push({
      id: "time-nudge",
      kind: "nudge",
      text: "Seu tempo também é custo. Uma estimativa honesta já ajuda bastante.",
    });
  }

  return items;
}
