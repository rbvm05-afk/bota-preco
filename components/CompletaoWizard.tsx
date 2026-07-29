"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/src/domain/pricing";
import { saveCalculation } from "@/lib/storage";
import { clearDraft, loadDraft, saveDraft } from "@/lib/DraftManager";
import {
  loadCompletaoParent,
  saveCompletaoParent,
} from "@/lib/continuity";
import { buildTestInput } from "@/lib/testFill";
import { resolveProfile } from "@/engine/profiles";
import {
  COMPLETAO_CHAPTERS,
  flattenQuestions,
  type FlatQuestion,
} from "@/src/domain/completao";
import type { MaterialItem, PricingInput } from "@/types/pricing";
import { AppShell } from "./AppShell";
import { Field } from "./Field";
import { MaterialEditor } from "./MaterialEditor";
import { PackagingEditor } from "./PackagingEditor";
import { ExtraCostsEditor } from "./ExtraCostsEditor";
import { MoneyField } from "./MoneyField";
import { NumberStepper } from "./NumberStepper";
import { ProductNameInput } from "./ProductNameInput";
import { PrimaryButton } from "./PrimaryButton";

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

function emptyInput(): PricingInput {
  return {
    productName: "",
    yieldAmount: 12,
    sellableUnits: 12,
    materials: [newMaterial()],
    workHours: 2,
    hourlyRate: 15,
    packagingItems: [],
    packagingPerUnit: 0,
    extraCosts: 0,
    extraCostItems: [],
    wastePercent: 5,
    salesFeePercent: 0,
    hasSalesFee: undefined,
    desiredMargin: 35,
    competitorPrice: undefined,
    hasCompetitorRef: undefined,
  };
}

/** Respostas extras dos capítulos (fora do PricingInput). */
type ChapterExtra = {
  fabricatesOrResells?: string;
  orderOrReady?: string;
  howSells?: string;
  worksAlone?: boolean;
  channels?: string[];
  desiredMonthlyIncome?: number;
  priority?: string;
};

export function CompletaoWizard() {
  const router = useRouter();
  const hydrated = useRef(false);
  const questions = useMemo(() => flattenQuestions(), []);

  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState<PricingInput>(emptyInput);
  const [extra, setExtra] = useState<ChapterExtra>({});
  const [fromRapidin, setFromRapidin] = useState(false);
  const [parentMeta, setParentMeta] = useState<{
    parentId?: string;
    rapidinHealthyPrice?: number;
  } | null>(null);

  useEffect(() => {
    const draft = loadDraft("completao");
    if (draft?.input) {
      setInput(draft.input);
      setQIndex(draft.stepIndex ?? 0);
      setFromRapidin(true);
    }
    const parent = loadCompletaoParent();
    if (parent) setParentMeta(parent);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const t = window.setTimeout(() => {
      saveDraft("completao", input, qIndex);
    }, 300);
    return () => window.clearTimeout(t);
  }, [input, qIndex]);

  const safeIndex = Math.max(0, Math.min(qIndex, questions.length - 1));
  const current = questions[safeIndex];
  const profile = useMemo(() => resolveProfile(input.productName), [input.productName]);

  const update = <K extends keyof PricingInput>(field: K, value: PricingInput[K]) =>
    setInput((c) => ({ ...c, [field]: value }));

  const next = () => {
    if (safeIndex >= questions.length - 1) {
      finish();
      return;
    }
    setQIndex(safeIndex + 1);
  };

  const back = () => {
    if (safeIndex <= 0) {
      router.push("/");
      return;
    }
    setQIndex(safeIndex - 1);
  };

  const finish = () => {
    const result = calculatePrice(input);
    const id = crypto.randomUUID();
    saveCalculation({
      id,
      createdAt: new Date().toISOString(),
      mode: "completao",
      input,
      result,
    });
    sessionStorage.setItem(
      "bota-preco-current",
      JSON.stringify({
        id,
        mode: "completao",
        input,
        result,
        parentId: parentMeta?.parentId,
        rapidinHealthyPrice: parentMeta?.rapidinHealthyPrice,
        chapterExtra: extra,
      }),
    );
    clearDraft("completao");
    router.push("/resultado");
  };

  const fillTester = () => {
    const filled = buildTestInput(input);
    setInput(filled);
    setExtra({
      fabricatesOrResells: "fabricates",
      orderOrReady: "both",
      howSells: "WhatsApp e Instagram",
      worksAlone: true,
      channels: ["whatsapp", "instagram"],
      desiredMonthlyIncome: 3000,
      priority: "balance",
    });
    setQIndex(questions.length - 1);
  };

  const chapterProgress = current
    ? `${current.indexInChapter + 1}/${current.chapterLen}`
    : "";

  return (
    <AppShell compact>
      {/* Trilha de capítulos */}
      <nav className="mb-5 flex gap-1.5 overflow-x-auto pb-1" aria-label="Capítulos">
        {COMPLETAO_CHAPTERS.map((ch) => {
          const active = current?.chapterId === ch.id;
          const done =
            current &&
            COMPLETAO_CHAPTERS.findIndex((c) => c.id === ch.id) <
              COMPLETAO_CHAPTERS.findIndex((c) => c.id === current.chapterId);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                const idx = questions.findIndex((q) => q.chapterId === ch.id);
                if (idx >= 0) setQIndex(idx);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition ${
                active
                  ? "bg-[var(--green)] text-white"
                  : done
                    ? "bg-[var(--green-soft)] text-[var(--green-deep)]"
                    : "bg-white text-[var(--muted)] border border-[var(--border)]"
              }`}
            >
              {ch.emoji} {ch.number}
            </button>
          );
        })}
      </nav>

      <section className="surface animate-rise rounded-[2.2rem] p-5 sm:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <div>
            <span className="rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-[var(--green)]">
              📋 Completão
            </span>
            {fromRapidin && (
              <span className="ml-2 text-xs font-bold text-[var(--muted)]">
                Continuando do Rapidin
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillTester}
              className="rounded-full border border-dashed border-[#c4a35a] bg-[#fffaf0] px-3 py-1.5 text-xs font-black text-[#8a6a00]"
            >
              🧪 Tester
            </button>
          </div>
        </div>

        {current && (
          <>
            <p className="mb-1 text-xs font-black uppercase tracking-[.14em] text-[var(--green)]">
              Capítulo {current.chapterNumber} · {current.chapterEmoji} {current.chapterTitle}
              <span className="ml-2 font-bold text-[var(--muted)]">({chapterProgress})</span>
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">
              {current.title}
            </h1>
            {current.text && (
              <p className="mt-3 leading-7 text-[var(--muted)]">{current.text}</p>
            )}

            <div className="mt-6">
              <ChapterQuestionBody
                q={current}
                input={input}
                extra={extra}
                profile={profile}
                update={update}
                setExtra={setExtra}
              />
            </div>
          </>
        )}

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
          <button
            type="button"
            onClick={back}
            className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 font-black sm:w-36"
          >
            ← Voltar
          </button>
          <PrimaryButton
            onClick={next}
            disabled={
              current?.id === "product-name" && !input.productName.trim()
            }
          >
            {safeIndex >= questions.length - 1
              ? "✨ Ver diagnóstico completo"
              : current?.optional
                ? "Continuar →"
                : "Continuar →"}
          </PrimaryButton>
        </div>
      </section>
    </AppShell>
  );
}

function ChapterQuestionBody({
  q,
  input,
  extra,
  profile,
  update,
  setExtra,
}: {
  q: FlatQuestion;
  input: PricingInput;
  extra: ChapterExtra;
  profile: ReturnType<typeof resolveProfile>;
  update: <K extends keyof PricingInput>(field: K, value: PricingInput[K]) => void;
  setExtra: React.Dispatch<React.SetStateAction<ChapterExtra>>;
}) {
  if (q.kind === "text" && q.field === "productName") {
    return (
      <ProductNameInput
        value={input.productName}
        onChange={(v) => update("productName", v)}
      />
    );
  }

  if (q.kind === "text") {
    const val =
      q.field === "howSells"
        ? extra.howSells ?? ""
        : "";
    return (
      <Field
        label={q.label}
        value={val}
        onChange={(e) => {
          if (q.field === "howSells") setExtra((x) => ({ ...x, howSells: e.target.value }));
        }}
        placeholder={q.text}
      />
    );
  }

  if (q.kind === "choice" && q.options) {
    const current =
      q.field === "fabricatesOrResells"
        ? extra.fabricatesOrResells
        : q.field === "orderOrReady"
          ? extra.orderOrReady
          : q.field === "priority"
            ? extra.priority
            : undefined;
    return (
      <div className="flex flex-col gap-3">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setExtra((x) => ({ ...x, [q.field]: opt.value }));
            }}
            className={`rounded-2xl border-2 px-5 py-4 text-left text-lg font-black transition ${
              current === opt.value
                ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-deep)]"
                : "border-[var(--border)] bg-white hover:border-[var(--green)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (q.kind === "boolean") {
    const val = extra.worksAlone;
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setExtra((x) => ({ ...x, worksAlone: false }))}
          className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
            val === false
              ? "border-[var(--green)] bg-[var(--green-soft)]"
              : "border-[var(--border)] bg-white"
          }`}
        >
          Sim, tenho ajuda
        </button>
        <button
          type="button"
          onClick={() => setExtra((x) => ({ ...x, worksAlone: true }))}
          className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
            val === true
              ? "border-[var(--green)] bg-[var(--green-soft)]"
              : "border-[var(--border)] bg-white"
          }`}
        >
          Não, trabalho sozinho(a)
        </button>
      </div>
    );
  }

  if (q.kind === "materials") {
    return (
      <MaterialEditor
        items={input.materials}
        onChange={(materials) => update("materials", materials)}
        materialLabel={profile.materialLabel}
        placeholder={profile.materialPlaceholder}
        suggestedMaterials={profile.suggestedMaterials}
      />
    );
  }

  if (q.kind === "packaging") {
    return (
      <PackagingEditor
        items={input.packagingItems ?? []}
        onChange={(packagingItems) => update("packagingItems", packagingItems)}
        suggestedPackaging={profile.suggestedPackaging}
        yieldAmount={input.yieldAmount}
      />
    );
  }

  if (q.kind === "yield-time") {
    return (
      <div className="space-y-6">
        <NumberStepper
          label="Quantas unidades essa produção deveria render?"
          value={input.yieldAmount || 1}
          min={1}
          onChange={(n) => {
            update("yieldAmount", n);
            if (
              input.sellableUnits === undefined ||
              input.sellableUnits === input.yieldAmount
            ) {
              update("sellableUnits", n);
            }
          }}
        />
        <NumberStepper
          label="Quantas horas de trabalho?"
          value={input.workHours || 0}
          min={0}
          step={0.25}
          onChange={(n) => update("workHours", n)}
        />
      </div>
    );
  }

  if (q.kind === "waste-pair") {
    return (
      <div className="space-y-6">
        <NumberStepper
          label="Deveriam sair"
          value={input.yieldAmount || 1}
          min={1}
          onChange={(n) => {
            const prev = input.yieldAmount;
            update("yieldAmount", n);
            if (input.sellableUnits === undefined || input.sellableUnits === prev) {
              update("sellableUnits", n);
            }
          }}
        />
        <NumberStepper
          label="Ficaram prontas para vender"
          value={input.sellableUnits ?? input.yieldAmount ?? 1}
          min={0}
          onChange={(n) => update("sellableUnits", n)}
        />
      </div>
    );
  }

  if (q.kind === "extras-list") {
    return (
      <ExtraCostsEditor
        items={input.extraCostItems ?? []}
        onChange={(extraCostItems) => update("extraCostItems", extraCostItems)}
      />
    );
  }

  if (q.kind === "money" && q.field === "hourlyRate") {
    return (
      <MoneyField
        label="Valor por hora"
        value={input.hourlyRate}
        onChange={(hourlyRate) => update("hourlyRate", hourlyRate)}
        placeholder="15,00"
      />
    );
  }

  if (q.kind === "money" && q.field === "desiredMonthlyIncome") {
    return (
      <MoneyField
        label="Renda mensal desejada"
        value={extra.desiredMonthlyIncome ?? 0}
        onChange={(desiredMonthlyIncome) =>
          setExtra((x) => ({ ...x, desiredMonthlyIncome }))
        }
        placeholder="3.000,00"
      />
    );
  }

  if (q.kind === "fees-gate") {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => update("hasSalesFee", true)}
            className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
              input.hasSalesFee === true
                ? "border-[var(--green)] bg-[var(--green-soft)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => {
              update("hasSalesFee", false);
              update("salesFeePercent", 0);
            }}
            className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
              input.hasSalesFee === false
                ? "border-[var(--green)] bg-[var(--green-soft)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            Não
          </button>
        </div>
        {input.hasSalesFee === true && (
          <Field
            label="Taxa sobre a venda (%)"
            type="number"
            min={0}
            max={40}
            step={0.1}
            value={input.salesFeePercent || ""}
            onChange={(e) => update("salesFeePercent", Number(e.target.value))}
          />
        )}
      </div>
    );
  }

  if (q.kind === "competition") {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => update("hasCompetitorRef", true)}
            className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
              input.hasCompetitorRef === true
                ? "border-[var(--green)] bg-[var(--green-soft)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => {
              update("hasCompetitorRef", false);
              update("competitorPrice", undefined);
            }}
            className={`flex-1 rounded-2xl border-2 px-5 py-4 text-lg font-black ${
              input.hasCompetitorRef === false
                ? "border-[var(--green)] bg-[var(--green-soft)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            Não
          </button>
        </div>
        {input.hasCompetitorRef === true && (
          <MoneyField
            label="Preço da concorrência"
            value={input.competitorPrice ?? 0}
            onChange={(competitorPrice) => update("competitorPrice", competitorPrice)}
          />
        )}
      </div>
    );
  }

  if (q.kind === "multi-choice" && q.options) {
    const selected = new Set(extra.channels ?? []);
    return (
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => {
          const on = selected.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                const next = new Set(selected);
                if (on) next.delete(opt.value);
                else next.add(opt.value);
                setExtra((x) => ({ ...x, channels: [...next] }));
              }}
              className={`rounded-full border px-4 py-2 text-sm font-black ${
                on
                  ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green-deep)]"
                  : "border-[var(--border)] bg-white"
              }`}
            >
              {on ? "✓ " : "+ "}{opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return null;
}
