import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-base outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-green-100"
      />
      {hint ? <span className="mt-2 block text-sm text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
