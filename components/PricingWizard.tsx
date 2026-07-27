"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/src/domain/pricing";
import { saveCalculation } from "@/lib/storage";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import { resolveProfile } from "@/engine/profiles";
import { getInputDefaults } from "@/src/domain/products";
import {
  buildFlow,
  clampStepIndex,
  progressPercent,
  validateInput,
} from "@/src/domain/flow";
import type { WizardQuestion } from "@/engine/types";
import type { MaterialItem, PricingInput } from "@/types/pricing";
import { AppShell } from "./AppShell";
import { Field } from "./Field";
import { MaterialEditor } from "./MaterialEditor";
import { PackagingEditor } from "./PackagingEditor";
import { ProductNameInput } from "./ProductNameInput";
import { PrimaryButton } from "./PrimaryButton";
import { Progress } from "./Progress";
import { Tip } from "./Tip";
import { LiveSummary } from "./LiveSummary";
import { AdSlot } from "./AdSlot";
import { ReviewStep } from "./ReviewStep";

const newMaterial = (): MaterialItem => ({
  id: crypto.randomUUID(),
  name: "",
  paid: 0,
  packageAmount: 0,
  packageUnit: "g",
  usedAmount: 0,
  usedUnit: "g",
});

function emptyInput(isComplete: boolean): PricingInput {
  return {
    productName: "",
    yieldAmount: 1,
    materials: [newMaterial()],
    workHours: 1,
    hourlyRate: 15,
    packagingItems: [],
    packagingPerUnit: 0,
    extraCosts: 0,
    wastePercent: isComplete ? 5 : 3,
    salesFeePercent: 0,
    desiredMargin: isComplete ? 35 : 30,
  };
}

export function PricingWizard({ mode }: { mode: "rapidin" | "completao" }) {
  const router = useRouter();
  const isComplete = mode === "completao";
  const hydrated = useRef(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<PricingInput>(() => emptyInput(isComplete));
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    const draft = loadDraft(mode);
    if (draft?.input) {
      setInput(draft.input);
      setStepIndex(draft.stepIndex ?? 0);
      setDraftRestored(true);
    }
    hydrated.current = true;
  }, [mode]);

  const profile = useMemo(() => resolveProfile(input.productName), [input.productName]);

  const lastProfileId = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated.current) return;
    if (!input.productName.trim()) return;
    if (lastProfileId.current === profile.id) return;
    if (draftRestored && lastProfileId.current === null) {
      lastProfileId.current = profile.id;
      return;
    }
    lastProfileId.current = profile.id;
    const defaults = getInputDefaults(input.productName);
    setInput((current) => ({
      ...current,
      yieldAmount: defaults.yieldAmount,
      wastePercent: defaults.wastePercent,
      workHours: defaults.workHours,
      hourlyRate: defaults.hourlyRate,
      desiredMargin: defaults.desiredMargin,
    }));
  }, [profile.id, input.productName, draftRestored]);

  const questions = profile.questions;
  const flow = useMemo(() => buildFlow(questions), [questions]);
  const safeIndex = clampStepIndex(stepIndex, flow.length);
  const currentStep = flow[safeIndex];
  const currentQuestion =
    currentStep?.kind === "question" ? questions[currentStep.questionIndex] : null;
  const isReview = currentStep?.kind === "review";
  const percent = progressPercent(safeIndex, flow.length);
  const issues = useMemo(() => validateInput(input, questions), [input, questions]);

  useEffect(() => {
    setStepIndex((i) => clampStepIndex(i, flow.length));
  }, [flow.length]);

  useEffect(() => {
    if (!hydrated.current) return;
    const timer = window.setTimeout(() => {
      saveDraft(mode, input, safeIndex);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [input, safeIndex, mode]);

  const update = <K extends keyof PricingInput>(field: K, value: PricingInput[K]) =>
    setInput((current) => ({ ...current, [field]: value }));

  const next = () => setStepIndex((i) => clampStepIndex(i + 1, flow.length));
  const back = () => {
    if (safeIndex <= 0) {
      router.push("/");
      return;
    }
    setStepIndex((i) => clampStepIndex(i - 1, flow.length));
  };
  const goTo = (stepId: string) => {
    const idx = flow.findIndex((s) => s.id === stepId);
    if (idx >= 0) setStepIndex(idx);
  };

  const finish = () => {
    if (issues.length > 0) return;
    const result = calculatePrice(input);
    const id = crypto.randomUUID();
    saveCalculation({ id, createdAt: new Date().toISOString(), mode, input, result });
    sessionStorage.setItem("bota-preco-current", JSON.stringify({ id, mode, input, result }));
    clearDraft(mode);
    router.push("/resultado");
  };

  const completed = (id: string) => {
    const idx = flow.findIndex((s) => s.id === id);
    return idx >= 0 && idx < safeIndex;
  };
  const showSummary = completed("materials") && !isReview;

  return (
    <AppShell compact>
      <Progress
        current={safeIndex + 1}
        total={flow.length}
        labels={flow.map((s) => s.label)}
        showTotal={!isComplete}
        percent={percent}
      />
      {showSummary && (
        <LiveSummary
          input={input}
          showLabor={completed("hourlyRate")}
          showPackaging={completed("packaging")}
          showExtras={completed("extras")}
        />
      )}

      <section className="surface animate-rise rounded-[2.2rem] p-5 sm:p-8">
        <div className="mb-7 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-[var(--green)]">
            {isComplete ? "🎯 Completão" : "⚡ Rapidin"}
          </span>
          <span className="text-right text-xs font-bold text-[var(--muted)]">
            {draftRestored ? "💾 Rascunho recuperado" : "💾 Progresso salvo automaticamente"}
          </span>
        </div>

        {isReview ? (
          <ReviewStep input={input} profile={profile} issues={issues} onEdit={goTo} />
        ) : (
          <QuestionRenderer
            question={currentQuestion}
            input={input}
            profile={profile}
            update={update}
          />
        )}

        {isComplete && safeIndex === 5 && !isReview && (
          <AdSlot placement="completao-mid-flow" className="mt-8" />
        )}

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
          <button
            type="button"
            onClick={back}
            className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 font-black transition hover:-translate-y-0.5 hover:bg-[#f4f1eb] sm:w-36"
          >
            ← Voltar
          </button>
          {isReview ? (
            <PrimaryButton onClick={finish} disabled={issues.length > 0}>
              ✨ Mostrar meu preço
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={next}
              disabled={currentQuestion?.id === "product" && !input.productName.trim()}
            >
              Continuar →
            </PrimaryButton>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function QuestionRenderer({
  question,
  input,
  profile,
  update,
}: {
  question: WizardQuestion | null;
  input: PricingInput;
  profile: ReturnType<typeof resolveProfile>;
  update: <K extends keyof PricingInput>(field: K, value: PricingInput[K]) => void;
}) {
  if (!question) return null;
  const product = input.productName || "seu produto";
  const title = question.title.replace("{produto}", product);
  const text = question.text.replace("{produto}", product);
  return (
    <QuestionBlock eyebrow={question.eyebrow} title={title} text={text}>
      {question.kind === "product" && (
        <ProductNameInput value={input.productName} onChange={(value) => update("productName", value)} />
      )}
      {question.kind === "materials" && (
        <MaterialEditor
          items={input.materials}
          onChange={(materials) => update("materials", materials)}
          materialLabel={profile.materialLabel}
          placeholder={profile.materialPlaceholder}
          suggestedMaterials={profile.suggestedMaterials}
        />
      )}
      {question.kind === "packaging" && (
        <PackagingEditor
          items={input.packagingItems ?? []}
          onChange={(packagingItems) => update("packagingItems", packagingItems)}
          suggestedPackaging={profile.suggestedPackaging}
          yieldAmount={input.yieldAmount}
        />
      )}
      {(question.kind === "number" || question.kind === "margin") && (
        <Field
          label={question.inputLabel ?? question.label}
          type="number"
          min={question.min}
          max={question.max}
          step={question.step}
          value={Number(input[question.field])}
          onChange={(event) => update(question.field, Number(event.target.value) as never)}
          hint={question.hint}
        />
      )}
      {question.tip && <Tip>{question.tip}</Tip>}
      {question.kind === "margin" && (
        <div className="rounded-2xl border border-green-200 bg-[var(--green-soft)] p-4 text-sm font-bold leading-6 text-[var(--green-deep)]">
          ✅ Na próxima tela você confere tudo antes de ver o preço.
        </div>
      )}
    </QuestionBlock>
  );
}

function QuestionBlock({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 font-black text-[var(--green)]">{eyebrow}</p>
        <h1 className="text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">{title}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{text}</p>
      </div>
      {children}
    </div>
  );
}
