"use client";

import { useEffect, useState } from "react";

function formatBRL(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parse digit-only or pt-BR decimal string into number (cents-safe). */
function parseMoney(raw: string): number {
  const cleaned = raw.replace(/[R$\s]/gi, "").replace(/\./g, "").replace(",", ".");
  if (cleaned === "" || cleaned === ".") return 0;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

/**
 * Campo monetário com edição livre.
 * Enquanto focado, mantém o texto digitado (sem reformatar a cada tecla).
 * Ao sair do campo, aplica máscara pt-BR.
 */
export function MoneyField({
  label,
  value,
  onChange,
  hint,
  placeholder = "0,00",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => formatBRL(value));

  useEffect(() => {
    if (!focused) setText(formatBRL(value));
  }, [value, focused]);

  return (
    <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
      {label}
      <div className="flex items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[#fffefa] focus-within:border-[var(--green)] focus-within:ring-3 focus-within:ring-green-100">
        <span className="border-r border-[var(--border)] bg-[#f7f4ee] px-3 py-3.5 font-black text-[var(--green-deep)]">
          R$
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={focused ? text : formatBRL(value)}
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            setText(value > 0 ? formatBRL(value) : "");
          }}
          onBlur={() => {
            setFocused(false);
            const n = parseMoney(text);
            onChange(n);
            setText(formatBRL(n));
          }}
          onChange={(e) => {
            const raw = e.target.value;
            // Permite dígitos, vírgula e ponto durante a digitação
            if (raw !== "" && !/^[\d.,\s]*$/.test(raw)) return;
            setText(raw);
            onChange(parseMoney(raw));
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-3.5 font-bold outline-none"
        />
      </div>
      {hint ? <span className="text-[11px] font-bold text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
