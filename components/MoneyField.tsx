"use client";

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
  const display =
    value > 0
      ? value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "";

  return (
    <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
      {label}
      <div className="flex items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[#fffefa]">
        <span className="border-r border-[var(--border)] bg-[#f7f4ee] px-3 py-3.5 font-black text-[var(--green-deep)]">
          R$
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
            const n = parseFloat(raw);
            onChange(Number.isFinite(n) ? Math.round(n * 100) / 100 : 0);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-3.5 font-bold outline-none"
        />
      </div>
      {hint ? <span className="text-[11px] font-bold text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
