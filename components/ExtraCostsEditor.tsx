"use client";

import type { ExtraCostItem } from "@/types/pricing";
import { MoneyField } from "./MoneyField";

const SUGGESTIONS = ["Gás", "Energia", "Entrega", "Etiqueta", "Taxa da maquininha", "Comissão", "Outro"];

export function ExtraCostsEditor({
  items,
  onChange,
}: {
  items: ExtraCostItem[];
  onChange: (items: ExtraCostItem[]) => void;
}) {
  const add = (name: string) => {
    if (name !== "Outro" && items.some((i) => i.name.toLowerCase() === name.toLowerCase())) return;
    onChange([
      ...items,
      { id: crypto.randomUUID(), name: name === "Outro" ? "" : name, amount: 0 },
    ]);
  };

  const update = (id: string, patch: Partial<ExtraCostItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--muted)]">
        Toque no que fez parte deste lote. Pode deixar zero se não tiver.
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-black transition hover:border-[var(--green)] hover:bg-[var(--green-soft)]"
          >
            + {s}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-[#f7f4ee] px-4 py-3 text-sm font-bold text-[var(--muted)]">
          Nenhum gasto extra por enquanto. Pode seguir.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
              <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
                Nome
                <input
                  value={item.name}
                  onChange={(e) => update(item.id, { name: e.target.value })}
                  placeholder="Ex.: Gás"
                  className="rounded-xl border border-[var(--border)] bg-[#fffefa] px-3 py-3 font-bold outline-none"
                />
              </label>
              <MoneyField
                label="Valor do lote"
                value={item.amount}
                onChange={(amount) => update(item.id, { amount })}
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="self-end rounded-xl border border-[var(--border)] px-3 py-3 text-xs font-black text-[var(--muted)] hover:border-[var(--red)] hover:text-[var(--red)]"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
