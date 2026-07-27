"use client";

import { useMemo, useRef, useState } from "react";
import { packagingRequiredUnits } from "@/lib/calculator";
import { getPackagingSuggestion, packagingNames } from "@/src/knowledge/packaging";
import type { PackagingItem, PackagingRule } from "@/types/pricing";

export { packagingRequiredUnits };

const inputClass =
  "rounded-xl border border-[var(--border)] bg-[#fffefa] px-3 py-3 font-bold outline-none transition focus:border-[var(--green)] focus:ring-3 focus:ring-green-100";

const normalizeName = (name: string) => name.toLocaleLowerCase("pt-BR");

const makeItem = (name = "", previous?: Partial<PackagingItem>): PackagingItem => {
  const suggestion = getPackagingSuggestion(name);
  return {
    id: previous?.id ?? crypto.randomUUID(),
    name: suggestion.name || name,
    paid: previous?.paid ?? 0,
    packageAmount: previous?.packageAmount ?? 0,
    rule: previous?.rule ?? suggestion.defaultRule,
    quantity: previous?.quantity ?? suggestion.defaultQuantity,
    everyXUnits: previous?.everyXUnits ?? suggestion.defaultEveryXUnits,
  };
};

export function PackagingEditor({
  items,
  onChange,
  suggestedPackaging,
  yieldAmount,
}: {
  items: PackagingItem[];
  onChange: (items: PackagingItem[]) => void;
  suggestedPackaging: string[];
  yieldAmount: number;
}) {
  const [customName, setCustomName] = useState("");
  const draftByName = useRef<Map<string, PackagingItem>>(new Map());

  const selectedNames = useMemo(
    () => new Set(items.map((item) => normalizeName(item.name)).filter(Boolean)),
    [items],
  );

  const recommendations =
    suggestedPackaging.length > 0 ? suggestedPackaging : packagingNames.slice(0, 5);

  const remember = (item: PackagingItem) => {
    if (!item.name.trim()) return;
    draftByName.current.set(normalizeName(item.name), { ...item });
  };

  const toggle = (name: string) => {
    const key = normalizeName(name);
    if (selectedNames.has(key)) {
      const current = items.find((item) => normalizeName(item.name) === key);
      if (current) remember(current);
      onChange(items.filter((item) => normalizeName(item.name) !== key));
      return;
    }
    const previous = draftByName.current.get(key);
    onChange([...items, makeItem(name, previous)]);
  };

  const addAllSuggested = () => {
    const additions = recommendations
      .filter((name) => !selectedNames.has(normalizeName(name)))
      .map((name) => makeItem(name, draftByName.current.get(normalizeName(name))));
    if (additions.length === 0) return;
    onChange([...items, ...additions]);
  };

  const update = <K extends keyof PackagingItem>(id: string, field: K, value: PackagingItem[K]) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [field]: value };
        remember(next);
        return next;
      }),
    );
  };

  const remove = (id: string) => {
    const current = items.find((item) => item.id === id);
    if (current) remember(current);
    onChange(items.filter((item) => item.id !== id));
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name || selectedNames.has(normalizeName(name))) return;
    onChange([...items, makeItem(name, draftByName.current.get(normalizeName(name)))]);
    setCustomName("");
  };

  return (
    <div className="space-y-6">
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-[var(--green-soft)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[var(--green-deep)]">Kit recomendado</p>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                Clique para adicionar ou remover. Nada entra na conta até você escolher.
              </p>
            </div>
            <button
              type="button"
              onClick={addAllSuggested}
              className="shrink-0 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Adicionar todos
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {recommendations.map((name) => {
              const active = selectedNames.has(normalizeName(name));
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggle(name)}
                  className={`rounded-full border px-3 py-2 text-sm font-black transition ${
                    active
                      ? "border-green-300 bg-white text-[var(--green-deep)]"
                      : "border-[var(--border)] bg-[#f4f1eb] text-[var(--muted)]"
                  }`}
                >
                  {active ? "✓ " : "+ "}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-white/50 px-4 py-5 text-center text-sm font-bold text-[var(--muted)]">
          Nenhuma embalagem na conta ainda. Escolha no kit ou adicione a sua.
        </p>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const required = packagingRequiredUnits(item, yieldAmount);
          const unitCost = item.packageAmount > 0 ? item.paid / item.packageAmount : 0;
          return (
            <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <input
                  value={item.name}
                  onChange={(e) => update(item.id, "name", e.target.value)}
                  className={`${inputClass} min-w-0 flex-1`}
                  aria-label="Nome da embalagem"
                />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-xl border border-[var(--border)] px-3 py-3 font-black text-[var(--muted)]"
                >
                  Remover
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                  PAGUEI
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.paid || ""}
                    onChange={(e) => update(item.id, "paid", Number(e.target.value))}
                    className={inputClass}
                    placeholder="0,00"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                  QUANTAS VIERAM
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.packageAmount || ""}
                    onChange={(e) => update(item.id, "packageAmount", Number(e.target.value))}
                    className={inputClass}
                    placeholder="Ex.: 50"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                  COMO É USADA
                  <select
                    value={item.rule}
                    onChange={(e) => update(item.id, "rule", e.target.value as PackagingRule)}
                    className={inputClass}
                  >
                    <option value="perUnit">Em cada unidade</option>
                    <option value="everyXUnits">A cada X unidades</option>
                    <option value="perBatch">Uma vez por lote</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                  QUANTIDADE
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantity || ""}
                    onChange={(e) => update(item.id, "quantity", Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              </div>
              {item.rule === "everyXUnits" && (
                <label className="mt-3 grid max-w-xs gap-1.5 text-xs font-black text-[var(--muted)]">
                  A CADA QUANTAS UNIDADES?
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.everyXUnits || ""}
                    onChange={(e) => update(item.id, "everyXUnits", Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              )}
              <div className="mt-4 rounded-xl bg-[#f7f4ee] px-3 py-2 text-sm font-bold text-[var(--muted)]">
                Para {Math.max(1, yieldAmount)} unidades:{" "}
                <strong className="text-[var(--text)]">
                  {required} {item.name.toLocaleLowerCase("pt-BR") || "unidades"}
                </strong>
                {unitCost > 0 && (
                  <>
                    {" "}
                    · custo estimado{" "}
                    <strong className="text-[var(--green-deep)]">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(required * unitCost)}
                    </strong>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          className={`${inputClass} flex-1`}
          placeholder="Outra embalagem: fita, cartão, caixa..."
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-xl bg-[var(--green)] px-5 py-3 font-black text-white"
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
}
