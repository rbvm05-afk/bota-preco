"use client";

import { useRef, useState } from "react";
import { inferUnits, searchKnowledge, unitLabels, type KnowledgeItem } from "@/src/knowledge";
import {
  PRICE_HISTORY_STORAGE_KEY,
  normalizePriceKey,
  type StoredPriceHistory,
} from "@/src/pricing/priceReference";
import type { MaterialItem, MeasurementUnit } from "@/types/pricing";

const normalizeName = (name: string) => name.toLocaleLowerCase("pt-BR");

const makeItem = (name = "", previous?: Partial<MaterialItem>): MaterialItem => {
  const units = inferUnits(name || previous?.name || "");
  return {
    id: previous?.id ?? crypto.randomUUID(),
    name: name || previous?.name || "",
    paid: previous?.paid ?? 0,
    packageAmount: previous?.packageAmount ?? 0,
    packageUnit: previous?.packageUnit ?? units.defaultUnit,
    usedAmount: previous?.usedAmount ?? 0,
    usedUnit: previous?.usedUnit ?? units.defaultUnit,
  };
};

const inputClass =
  "rounded-xl border border-[var(--border)] bg-[#fffefa] px-3 py-3.5 font-bold outline-none transition placeholder:font-normal placeholder:text-[#a1a39e] focus:border-[var(--green)] focus:ring-3 focus:ring-green-100";

const categoryLabel: Record<KnowledgeItem["category"], string> = {
  ingrediente: "Ingrediente",
  embalagem: "Embalagem",
  material: "Material",
  decoracao: "Decoração",
};

function MaterialNameInput({
  item, onUpdate, onChoose, materialLabel, placeholder,
}: {
  item: MaterialItem;
  onUpdate: (value: string) => void;
  onChoose: (suggestion: KnowledgeItem) => void;
  materialLabel: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = searchKnowledge(item.name);
  return (
    <label className="relative grid gap-1.5 text-xs font-black text-[var(--muted)]">
      NOME DO {materialLabel.toLocaleUpperCase("pt-BR")}
      <input value={item.name} onChange={(e) => { onUpdate(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 120)} placeholder={placeholder} className={inputClass} autoComplete="off" />
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xl">
          {suggestions.map((s) => (
            <button key={s.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChoose(s); setOpen(false); }} className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-[var(--green-soft)]">
              <span className="font-black">{s.name}</span>
              <span className="rounded-full bg-[var(--green-soft)] px-2 py-1 text-[10px] font-black text-[var(--green)]">{categoryLabel[s.category]}</span>
            </button>
          ))}
        </div>
      )}
    </label>
  );
}

function AmountWithUnit({ label, value, unit, allowedUnits, placeholder, onValueChange, onUnitChange }: {
  label: string; value: number; unit: MeasurementUnit; allowedUnits: MeasurementUnit[]; placeholder: string;
  onValueChange: (value: string) => void; onUnitChange: (unit: MeasurementUnit) => void;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
      {label}
      <div className="grid grid-cols-[1fr_auto] overflow-hidden rounded-xl border border-[var(--border)] bg-[#fffefa]">
        <input type="number" min="0" step="0.01" value={value || ""} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} className="min-w-0 bg-transparent px-3 py-3.5 font-bold outline-none" />
        <select value={unit} onChange={(e) => onUnitChange(e.target.value as MeasurementUnit)} className="border-l border-[var(--border)] bg-[#f7f4ee] px-3 font-black text-[var(--green-deep)] outline-none">
          {allowedUnits.map((o) => <option key={o} value={o}>{unitLabels[o]}</option>)}
        </select>
      </div>
    </label>
  );
}

export function MaterialEditor({ items, onChange, materialLabel, placeholder, suggestedMaterials = [] }: {
  items: MaterialItem[]; onChange: (items: MaterialItem[]) => void; materialLabel: string; placeholder: string; suggestedMaterials?: string[];
}) {
  const draftByName = useRef<Map<string, MaterialItem>>(new Map());
  const remember = (item: MaterialItem) => { if (item.name.trim()) draftByName.current.set(normalizeName(item.name), { ...item }); };

  const update = <K extends keyof MaterialItem>(id: string, field: K, value: MaterialItem[K]) =>
    onChange(items.map((item) => { if (item.id !== id) return item; const next = { ...item, [field]: value }; remember(next); return next; }));

  const updateName = (id: string, name: string) => {
    const units = inferUnits(name);
    onChange(items.map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, name, packageUnit: units.allowedUnits.includes(item.packageUnit) ? item.packageUnit : units.defaultUnit, usedUnit: units.allowedUnits.includes(item.usedUnit) ? item.usedUnit : units.defaultUnit };
      remember(next); return next;
    }));
  };

  const chooseKnowledge = (id: string, suggestion: KnowledgeItem) => {
    onChange(items.map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, name: suggestion.name, packageUnit: suggestion.defaultUnit, usedUnit: suggestion.defaultUnit };
      remember(next); return next;
    }));
  };

  const remove = (id: string) => {
    const current = items.find((i) => i.id === id);
    if (current) remember(current);
    const next = items.filter((i) => i.id !== id);
    onChange(next.length > 0 ? next : [makeItem()]);
  };

  const toggleSuggested = (name: string) => {
    const key = normalizeName(name);
    const existing = items.find((i) => normalizeName(i.name) === key);
    if (existing) {
      remember(existing);
      const next = items.filter((i) => i.id !== existing.id);
      onChange(next.length > 0 ? next : [makeItem()]);
      return;
    }
    const suggested = makeItem(name, draftByName.current.get(key));
    const emptyIndex = items.findIndex((i) => !i.name && !i.paid && !i.packageAmount && !i.usedAmount);
    if (emptyIndex >= 0) {
      onChange(items.map((item, index) => (index === emptyIndex ? { ...suggested, id: item.id } : item)));
      return;
    }
    onChange([...items, suggested]);
  };

  const addAllSuggested = () => {
    const existing = new Set(items.filter((i) => i.name).map((i) => normalizeName(i.name)));
    const additions = suggestedMaterials.filter((n) => !existing.has(normalizeName(n))).map((n) => makeItem(n, draftByName.current.get(normalizeName(n))));
    const meaningful = items.filter((i) => i.name || i.paid || i.packageAmount || i.usedAmount);
    onChange(additions.length || meaningful.length ? [...meaningful, ...additions] : [makeItem()]);
  };

  const savePriceHistory = (item: MaterialItem) => {
    if (!item.name.trim() || item.paid <= 0) return;
    try {
      const raw = window.localStorage.getItem(PRICE_HISTORY_STORAGE_KEY);
      const history: StoredPriceHistory = raw ? JSON.parse(raw) : {};
      history[normalizePriceKey(item.name)] = { source: "history", amount: item.paid, currency: "BRL", label: "Seu último preço", packageAmount: item.packageAmount || undefined, packageUnit: item.packageUnit, savedAt: new Date().toISOString() };
      window.localStorage.setItem(PRICE_HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      {suggestedMaterials.length > 0 && (
        <div className="rounded-3xl border border-green-200 bg-[var(--green-soft)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[var(--green-deep)]">Monte sua receita mais rápido</p>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">Clique para adicionar ou remover. Nada entra na conta até você escolher.</p>
            </div>
            <button type="button" onClick={addAllSuggested} className="shrink-0 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-black text-white">Adicionar todos</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedMaterials.map((name) => {
              const added = items.some((i) => normalizeName(i.name) === normalizeName(name));
              return (
                <button key={name} type="button" onClick={() => toggleSuggested(name)} className={`rounded-full border px-3 py-2 text-xs font-black ${added ? "border-green-300 bg-white text-[var(--green-deep)]" : "border-green-200 bg-white/70 text-[var(--green-deep)]"}`}>
                  {added ? "✓ " : "+ "}{name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {items.map((item, index) => {
        const unitConfig = inferUnits(item.name);
        return (
          <div key={item.id} className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--green-soft)] text-sm font-black text-[var(--green)]">{index + 1}</span>
                <strong>{item.name || `${materialLabel.charAt(0).toUpperCase()}${materialLabel.slice(1)} ${index + 1}`}</strong>
              </div>
              <button type="button" onClick={() => remove(item.id)} className="rounded-xl px-3 py-2 text-xs font-black text-[var(--red)] hover:bg-red-50">Remover</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MaterialNameInput item={item} onUpdate={(v) => updateName(item.id, v)} onChoose={(s) => chooseKnowledge(item.id, s)} materialLabel={materialLabel} placeholder={placeholder} />
              <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                QUANTO PAGOU?
                <input type="number" min="0" step="0.01" value={item.paid || ""} onChange={(e) => update(item.id, "paid", Number(e.target.value))} onBlur={() => savePriceHistory(item)} placeholder="Ex.: 35,00" className={inputClass} />
              </label>
              <AmountWithUnit label="QUANTO VEIO NA EMBALAGEM?" value={item.packageAmount} unit={item.packageUnit} allowedUnits={unitConfig.allowedUnits} placeholder="Ex.: 395" onValueChange={(v) => update(item.id, "packageAmount", Number(v))} onUnitChange={(u) => update(item.id, "packageUnit", u)} />
              <AmountWithUnit label="QUANTO USOU NESTE LOTE?" value={item.usedAmount} unit={item.usedUnit} allowedUnits={unitConfig.allowedUnits} placeholder="Ex.: 50" onValueChange={(v) => update(item.id, "usedAmount", Number(v))} onUnitChange={(u) => update(item.id, "usedUnit", u)} />
            </div>
          </div>
        );
      })}

      <button type="button" onClick={() => onChange([...items, makeItem()])} className="w-full rounded-2xl border border-dashed border-[#8db49a] bg-white/45 px-4 py-4 font-black text-[var(--green)] hover:bg-[var(--green-soft)]">
        ＋ Adicionar outro {materialLabel}
      </button>
    </div>
  );
}
