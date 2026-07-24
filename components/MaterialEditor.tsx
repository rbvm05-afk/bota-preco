"use client";

import type { MaterialItem } from "@/types/pricing";

const makeItem = (): MaterialItem => ({
  id: crypto.randomUUID(),
  name: "",
  paid: 0,
  packageAmount: 0,
  usedAmount: 0,
});

export function MaterialEditor({
  items,
  onChange,
}: {
  items: MaterialItem[];
  onChange: (items: MaterialItem[]) => void;
}) {
  const update = (id: string, field: keyof MaterialItem, value: string) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "name" ? value : Number(value),
            }
          : item
      )
    );
  };

  const remove = (id: string) => {
    if (items.length === 1) return;
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-3xl border border-[var(--border)] bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <strong>Item {index + 1}</strong>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="text-sm font-bold text-[var(--red)] disabled:opacity-30"
              disabled={items.length === 1}
            >
              Remover
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={item.name}
              onChange={(event) => update(item.id, "name", event.target.value)}
              placeholder="Ex.: cera de soja"
              className="rounded-xl border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--green)]"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.paid || ""}
              onChange={(event) => update(item.id, "paid", event.target.value)}
              placeholder="Quanto pagou?"
              className="rounded-xl border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--green)]"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.packageAmount || ""}
              onChange={(event) => update(item.id, "packageAmount", event.target.value)}
              placeholder="Quanto veio?"
              className="rounded-xl border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--green)]"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.usedAmount || ""}
              onChange={(event) => update(item.id, "usedAmount", event.target.value)}
              placeholder="Quanto usou?"
              className="rounded-xl border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--green)]"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, makeItem()])}
        className="w-full rounded-2xl border-2 border-dashed border-[var(--green)] px-4 py-3 font-black text-[var(--green)] hover:bg-[var(--green-soft)]"
      >
        + Adicionar outro item
      </button>
    </div>
  );
}
