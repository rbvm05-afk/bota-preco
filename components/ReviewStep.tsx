"use client";

import { calculatePrice, money } from "@/src/domain/pricing";
import type { FieldIssue } from "@/src/domain/flow";
import type { PricingInput } from "@/types/pricing";
import type { ProductProfile } from "@/engine/types";

export function ReviewStep({
  input,
  profile,
  issues,
  onEdit,
}: {
  input: PricingInput;
  profile: ProductProfile;
  issues: FieldIssue[];
  onEdit: (stepId: string) => void;
}) {
  const result = calculatePrice(input);
  const materials = input.materials.filter((m) => m.name.trim());
  const packaging = (input.packagingItems ?? []).filter((p) => p.name.trim());

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 font-black text-[var(--green)]">📋 Quase lá</p>
        <h1 className="text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">
          Confira antes de ver o preço
        </h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Se algo estiver errado, toque em Editar. Nada se perde.
        </p>
      </div>

      {issues.length > 0 && (
        <div className="rounded-2xl border border-[#efb6ad] bg-[#fff1ef] p-4">
          <strong className="text-sm font-black text-[var(--red)]">Pendências</strong>
          <ul className="mt-2 space-y-2">
            {issues.map((issue) => (
              <li key={issue.stepId + issue.message} className="flex items-start justify-between gap-3 text-sm">
                <span>
                  <strong>{issue.label}:</strong> {issue.message}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit(issue.stepId)}
                  className="shrink-0 font-black text-[var(--green)] underline"
                >
                  Corrigir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ReviewCard title="Produto" onEdit={() => onEdit("product")}>
        <p className="font-black text-lg">{input.productName || "—"}</p>
        <p className="text-sm text-[var(--muted)]">{profile.category}</p>
      </ReviewCard>

      <ReviewCard title="Rendimento e tempo" onEdit={() => onEdit("yield")}>
        <p>
          <strong>{input.yieldAmount}</strong> unidades · <strong>{input.workHours}h</strong> a{" "}
          {money(input.hourlyRate)}/h
        </p>
      </ReviewCard>

      <ReviewCard title={`Materiais (${materials.length})`} onEdit={() => onEdit("materials")}>
        {materials.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum material informado.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {materials.map((m) => (
              <li key={m.id}>
                {m.name} — {money(m.paid)}
              </li>
            ))}
          </ul>
        )}
      </ReviewCard>

      {profile.suggestedPackaging.length > 0 && (
        <ReviewCard title={`Embalagens (${packaging.length})`} onEdit={() => onEdit("packaging")}>
          {packaging.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Nenhuma embalagem selecionada.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {packaging.map((p) => (
                <li key={p.id}>
                  {p.name} — {money(p.paid)}
                </li>
              ))}
            </ul>
          )}
        </ReviewCard>
      )}

      <ReviewCard title="Margem e taxas" onEdit={() => onEdit("margin")}>
        <p className="text-sm">
          Margem <strong>{input.desiredMargin}%</strong>
          {input.salesFeePercent > 0 ? ` · Taxa ${input.salesFeePercent}%` : ""}
          {input.wastePercent > 0 ? ` · Perdas ${input.wastePercent}%` : ""}
        </p>
      </ReviewCard>

      <div className="rounded-2xl border border-green-200 bg-[var(--green-soft)] p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--green)]">Prévia do preço verde</p>
        <p className="mt-1 text-2xl font-black text-[var(--green-deep)]">{money(result.healthyPrice)}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Valor estimado — confirme para ver o detalhamento completo.</p>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <strong className="text-sm font-black">{title}</strong>
        <button type="button" onClick={onEdit} className="text-xs font-black text-[var(--green)] underline">
          Editar
        </button>
      </div>
      {children}
    </div>
  );
}
