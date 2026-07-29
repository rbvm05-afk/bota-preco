"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/src/domain/pricing";
import { saveCalculation } from "@/lib/storage";
import { clearDraft, loadDraft, saveDraft } from "@/lib/DraftManager";
import { resolveProfile } from "@/engine/profiles";
import { getInputDefaults } from "@/src/domain/products";
import {
  buildFlow,
  clampStepIndex,
  validateInput,
} from "@/src/domain/flow";
import type { WizardQuestion } from "@/engine/types";
import type { MaterialItem, PricingInput } from "@/types/pricing";
import { AppShell } from "./AppShell";
import { Field } from "./Field";
import { MaterialEditor } from "./MaterialEditor";
import { PackagingEditor } from "./PackagingEditor";
import { ExtraCostsEditor } from "./ExtraCostsEditor";
import { MoneyField } from "./MoneyField";
import { ProductNameInput } from "./ProductNameInput";
import { PrimaryButton } from "./PrimaryButton";
import { Progress } from "./Progress";
import { WizardContextPanel } from "./WizardContextPanel";
import { getStepContext } from "@/src/domain/wizard";
import { AdSlot } from "./AdSlot";
import { ReviewStep } from "./ReviewStep";

const newMaterial = (): MaterialItem => ({
  id: crypto.randomUUID(),
  name: "",
  brand: "Genérica",
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
    sellableUnits: undefined,
    materials: [newMaterial()],
    workHours: 1,
    hourlyRate: 15,
    packagingItems: [],
    packagingPerUnit: 0,
    extraCosts: 0,
    extraCostItems: [],
    wastePercent: isComplete ? 5 : 3,
    salesFeePercent: 0,
    hasSalesFee: undefined,
    desiredMargin: isComplete ? 35 : 30,
    competitorPrice: undefined,
    hasCompetitorRef: undefined,
  };
}

export function PricingWizard({ mode }: { mode: "rapidin" | "completao" }) {
  const router = useRouter();
  const isComplete = mode === "completao";
  const hydrated = useRef(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<PricingInput>(() => emptyInput(isComplete));
  const [draftRestored, setDraftRestored] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

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
      sellableUnits: current.sellableUnits ?? defaults.yieldAmount,
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

  const startOver = () => {
    clearDraft(mode);
    setInput(emptyInput(isComplete));
    setStepIndex(0);
    setDraftRestored(false);
    lastProfileId.current = null;
    setConfirmReset(false);
  };

  const contextItems = useMemo(
    () => getStepContext(currentQuestion, input, isReview),
    [currentQuestion, input, isReview]
  );

  return (
    <AppShell compact>
      <Progress
        current={safeIndex + 1}
        total={flow.length}
        labels={flow.map((s) => s.label)}
      />

      <section className="surface animate-rise rounded-[2.2rem] p-5 sm:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-[var(--green)]">
            {isComplete ? "🎯 Completão" : "⚡ Rapidin"}
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden text-right text-xs font-bold text-[var(--muted)] sm:inline">
              {draftRestored ? "Rascunho recuperado" : "Salvo automaticamente"}
            </span>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-black text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)]"
            >
              Novo cálculo
            </button>
          </div>
        </div>

        {confirmReset && (
          <div
            className="mb-6 rounded-2xl border border-[var(--border)] bg-[#fffaf0] p-4 sm:p-5"
            role="dialog"
            aria-modal="true"
          >
            <p className="font-bold leading-6 text-[var(--foreground)]">
              Quer começar um novo cálculo? As informações preenchidas neste rascunho serão apagadas.
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 font-black"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={startOver}
                className="rounded-2xl bg-[var(--green)] px-4 py-3 font-black text-white"
              >
                Começar do zero
              </button>
            </div>
          </div>
        )}

        {isReview ? (
          <ReviewStep input={input} profile={profile} issues={issues} onEdit={goTo} />
        ) : (
          <QuestionRenderer
            question={currentQuestion}
            input={input}
            profile={profile}
            update={update}
            setInput={setInput}
          />
        )}

        <WizardContextPanel items={contextItems} />

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

function GateButtons({
  value,
  onYes,
  onNo,
}: {
  value: boolean | undefined;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onYes}
        className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black transition ${
          value === true
            ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-deep)]"
            : "border-[var(--border)] bg-white hover:border-[var(--green)]"
        }`}
      >
        Sim
      </button>
      <button
        type="button"
        onClick={onNo}
        className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black transition ${
          value === false
            ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-deep)]"
            : "border-[var(--border)] bg-white hover:border-[var(--green)]"
        }`}
      >
        Não
      </button>
    </div>
  );
}

function QuestionRenderer({
  question,
  input,
  profile,
  update,
  setInput,
}: {
  question: WizardQuestion | null;
  input: PricingInput;
  profile: ReturnType<typeof resolveProfile>;
  update: <K extends keyof PricingInput>(field: K, value: PricingInput[K]) => void;
  setInput: React.Dispatch<React.SetStateAction<PricingInput>>;
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

      {question.kind === "yield-time" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={`Quantidade (${profile.displayName ? "unidades" : "unidades"})`}
            type="number"
            min={1}
            step={1}
            value={input.yieldAmount || ""}
            onChange={(e) => {
              const n = Number(e.target.value);
              update("yieldAmount", n);
              if (input.sellableUnits === undefined || input.sellableUnits === input.yieldAmount) {
                update("sellableUnits", n);
              }
            }}
            hint="Quantas unidades essa receita deveria render."
          />
          <Field
            label="Horas de trabalho"
            type="number"
            min={0}
            step={0.25}
            value={input.workHours || ""}
            onChange={(e) => update("workHours", Number(e.target.value))}
            hint="Ex.: 1,5 = 1 hora e 30 minutos."
          />
        </div>
      )}

      {question.kind === "extras-list" && (
        <div className="space-y-8">
          {question.field === "extraCostItems" && (
            <ExtraCostsEditor
              items={input.extraCostItems ?? []}
              onChange={(extraCostItems) => update("extraCostItems", extraCostItems)}
            />
          )}
          <MoneyField
            label="Quanto deseja receber por hora?"
            value={input.hourlyRate}
            onChange={(hourlyRate) => update("hourlyRate", hourlyRate)}
            hint="O valor é só uma referência. Você manda na conta."
            placeholder="15,00"
          />
        </div>
      )}

      {question.kind === "waste-pair" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Esta receita deveria render quantas unidades?"
            type="number"
            min={1}
            step={1}
            value={input.yieldAmount || ""}
            onChange={(e) => update("yieldAmount", Number(e.target.value))}
          />
          <Field
            label="Quantas ficaram prontas para vender?"
            type="number"
            min={0}
            step={1}
            value={input.sellableUnits ?? input.yieldAmount ?? ""}
            onChange={(e) => update("sellableUnits", Number(e.target.value))}
            hint="O Bota calcula o desperdício sozinho."
          />
          {input.sellableUnits !== undefined &&
            input.yieldAmount > 0 &&
            input.sellableUnits < input.yieldAmount && (
              <p className="sm:col-span-2 rounded-2xl bg-[#fff8df] px-4 py-3 text-sm font-bold text-[#8a6a00]">
                Desperdício estimado:{" "}
                {Math.round(((input.yieldAmount - input.sellableUnits) / input.yieldAmount) * 1000) /
                  10}
                % ({input.yieldAmount - input.sellableUnits} unidade
                {input.yieldAmount - input.sellableUnits !== 1 ? "s" : ""})
              </p>
            )}
        </div>
      )}

      {question.kind === "fees-gate" && (
        <div className="space-y-5">
          <GateButtons
            value={input.hasSalesFee}
            onYes={() => update("hasSalesFee", true)}
            onNo={() => {
              update("hasSalesFee", false);
              update("salesFeePercent", 0);
            }}
          />
          {input.hasSalesFee === true && (
            <Field
              label="Taxa sobre a venda (%)"
              type="number"
              min={0}
              max={40}
              step={0.1}
              value={input.salesFeePercent || ""}
              onChange={(e) => update("salesFeePercent", Number(e.target.value))}
              hint="Cartão, marketplace, app ou comissão."
            />
          )}
        </div>
      )}

      {question.kind === "competition" && (
        <div className="space-y-5">
          <GateButtons
            value={input.hasCompetitorRef}
            onYes={() => update("hasCompetitorRef", true)}
            onNo={() => {
              update("hasCompetitorRef", false);
              update("competitorPrice", undefined);
            }}
          />
          {input.hasCompetitorRef === true && (
            <MoneyField
              label="Preço da concorrência (referência)"
              value={input.competitorPrice ?? 0}
              onChange={(competitorPrice) => update("competitorPrice", competitorPrice)}
              hint="Não entra no cálculo de custo — só para você comparar."
            />
          )}
        </div>
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
