"use client";

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <label className="grid gap-1.5 text-xs font-black text-[var(--muted)]">
      {label}
      <div className="flex items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[#fffefa]">
        <button
          type="button"
          aria-label="Diminuir"
          onClick={() => onChange(clamp((value || 0) - step))}
          className="grid size-12 shrink-0 place-items-center border-r border-[var(--border)] bg-[#f7f4ee] text-xl font-black text-[var(--green-deep)] transition hover:bg-[var(--green-soft)]"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange(min);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) onChange(clamp(n));
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-center text-lg font-black outline-none"
        />
        <button
          type="button"
          aria-label="Aumentar"
          onClick={() => onChange(clamp((value || 0) + step))}
          className="grid size-12 shrink-0 place-items-center border-l border-[var(--border)] bg-[#f7f4ee] text-xl font-black text-[var(--green-deep)] transition hover:bg-[var(--green-soft)]"
        >
          +
        </button>
      </div>
      {hint ? <span className="text-[11px] font-bold text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
