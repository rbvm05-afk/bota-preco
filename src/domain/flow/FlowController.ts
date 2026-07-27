import type { WizardQuestion } from "@/engine/types";
import type { PricingInput } from "@/types/pricing";

export type FlowStepId = string;

export type FlowStep = {
  id: FlowStepId;
  label: string;
  questionIndex: number;
  kind: "question" | "review";
};

export function buildFlow(questions: WizardQuestion[]): FlowStep[] {
  const steps: FlowStep[] = questions.map((q, index) => ({
    id: q.id,
    label: q.label,
    questionIndex: index,
    kind: "question" as const,
  }));

  steps.push({
    id: "review",
    label: "Revisão",
    questionIndex: -1,
    kind: "review",
  });

  return steps;
}

export function clampStepIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(index, total - 1));
}

export function progressPercent(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(((currentIndex + 1) / total) * 100);
}

export type FieldIssue = {
  stepId: string;
  label: string;
  message: string;
};

export function validateInput(input: PricingInput, questions: WizardQuestion[]): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const hasStep = (id: string) => questions.some((q) => q.id === id);

  if (!input.productName.trim()) {
    issues.push({ stepId: "product", label: "Produto", message: "Informe o nome do produto." });
  }

  if (hasStep("materials")) {
    const useful = input.materials.filter((m) => m.name.trim());
    if (useful.length === 0) {
      issues.push({ stepId: "materials", label: "Materiais", message: "Adicione pelo menos um material com nome." });
    } else {
      const incomplete = useful.some((m) => !m.paid || !m.packageAmount || !m.usedAmount);
      if (incomplete) {
        issues.push({
          stepId: "materials",
          label: "Materiais",
          message: "Preencha preço, quantidade da embalagem e quanto usou.",
        });
      }
    }
  }

  if (hasStep("yield") && (!input.yieldAmount || input.yieldAmount < 1)) {
    issues.push({ stepId: "yield", label: "Rendimento", message: "Rendimento precisa ser pelo menos 1." });
  }

  if (hasStep("hours") && input.workHours < 0) {
    issues.push({ stepId: "hours", label: "Tempo", message: "Horas não podem ser negativas." });
  }

  return issues;
}
