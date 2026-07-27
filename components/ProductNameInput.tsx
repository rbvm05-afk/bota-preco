"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/src/knowledge";

const examples = ["vela aromática", "brigadeiro", "marmita fit", "bolo de pote", "sabonete artesanal", "brownie"];

export function ProductNameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const suggestions = searchProducts(value);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setExampleIndex((current) => (current + 1) % examples.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, []);

  const chooseSuggestion = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <label className="relative block">
      <span className="mb-2 block text-sm font-black text-[var(--green-deep)]">Nome do produto</span>
      <input
        autoFocus
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        placeholder={`Ex.: ${examples[exampleIndex]}`}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-base font-bold outline-none transition placeholder:font-normal placeholder:text-[#9b9f98] hover:border-[#bdb5a7] focus:border-[var(--green)] focus:ring-4 focus:ring-green-100"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xl">
          <div className="border-b border-[var(--border)] px-4 py-2 text-[10px] font-black uppercase tracking-wide text-[var(--muted)]">Sugestões de produto</div>
          {suggestions.map((suggestion) => (
            <button key={suggestion.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(suggestion.name)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--green-soft)]">
              <span className="font-black text-[var(--text)]">{suggestion.name}</span>
              <span className="rounded-full bg-[var(--green-soft)] px-2 py-1 text-[10px] font-black text-[var(--green)]">{suggestion.group}</span>
            </button>
          ))}
        </div>
      )}
    </label>
  );
}
